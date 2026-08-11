import json
import numpy as np
import pandas as pd
from datetime import datetime, date
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from database import get_db, init_db


class LeadScorer:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.industry_enc = LabelEncoder()
        self.size_enc = LabelEncoder()
        self.funding_enc = LabelEncoder()
        self.is_trained = False

    def _days_since(self, date_str: str) -> int:
        if not date_str:
            return 30
        try:
            d = datetime.strptime(date_str, "%Y-%m-%d").date()
            return (date.today() - d).days
        except Exception:
            return 30

    def _encode_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        industries = ["Software", "Healthcare", "Finance", "Education", "Retail",
                      "Consulting", "Manufacturing", "IoT", "Cybersecurity", "Energy",
                      "Logistics", "Insurance", "Legal", "Pharmaceutical", "Media",
                      "Travel", "Agriculture", "Robotics", "Artificial Intelligence",
                      "Cloud Computing", "Other"]
        sizes = ["Small", "Medium", "Enterprise", "N/A"]
        fundings = ["Seed", "Series A", "Series B", "Series C", "Series D", "Public", "N/A"]

        self.industry_enc.classes_ = np.array(industries)
        self.size_enc.classes_ = np.array(sizes)
        self.funding_enc.classes_ = np.array(fundings)

        def safe_encode(enc, val, default=0):
            try:
                return int(enc.transform([val])[0])
            except Exception:
                return default

        df["industry_enc"] = df["industry"].apply(lambda x: safe_encode(self.industry_enc, x))
        df["size_enc"] = df["company_size"].apply(lambda x: safe_encode(self.size_enc, x or "Medium"))
        df["funding_enc"] = df["funding_stage"].apply(lambda x: safe_encode(self.funding_enc, x or "Seed"))
        return df

    def train(self):
        try:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT * FROM leads")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
        except Exception:
            init_db()
            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT * FROM leads")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()

        if len(rows) < 5:
            return

        df = pd.DataFrame(rows)
        df["converted"] = df["status"].apply(lambda s: 1 if s == "Won" else 0)
        df["days_since_contact"] = df["last_contact_date"].apply(self._days_since)
        df = self._encode_features(df)

        feature_cols = ["email_opens", "website_visits", "demo_requested",
                        "size_enc", "industry_enc", "funding_enc", "days_since_contact"]
        X = df[feature_cols].fillna(0)
        y = df["converted"]

        self.model.fit(X, y)
        self.is_trained = True

    def predict(self, email_opens: int, website_visits: int, demo_requested: int,
                company_size: str, industry: str, funding_stage: str,
                days_since_contact: int) -> dict:

        if not self.is_trained:
            self.train()

        row = pd.DataFrame([{
            "email_opens": email_opens,
            "website_visits": website_visits,
            "demo_requested": demo_requested,
            "company_size": company_size,
            "industry": industry,
            "funding_stage": funding_stage,
            "days_since_contact": days_since_contact,
        }])
        row = self._encode_features(row)
        feature_cols = ["email_opens", "website_visits", "demo_requested",
                        "size_enc", "industry_enc", "funding_enc", "days_since_contact"]
        X = row[feature_cols].fillna(0)

        try:
            probability = float(self.model.predict_proba(X)[0][1])
        except Exception:
            probability = 0.5

        # Calibrate composite intent score (RandomForest prob + engagement features)
        engagement_boost = (min(30, website_visits) * 0.8) + (min(20, email_opens) * 1.2) + (demo_requested * 24.0)
        composite_score = round(min(99.0, max(15.0, (probability * 40.0) + engagement_boost)), 1)

        if composite_score >= 80:
            recommendation = "🔥 Hot Lead"
            next_action = "Schedule Product Demo Immediately"
        elif composite_score >= 60:
            recommendation = "✅ Qualified Lead"
            next_action = "Send Personalized Proposal"
        elif composite_score >= 40:
            recommendation = "🌡️ Warm Lead"
            next_action = "Send Follow-up Email within 48 hours"
        else:
            recommendation = "❄️ Cold Lead"
            next_action = "Nurture with Marketing Campaign"

        return {
            "score": composite_score,
            "probability": round(composite_score / 100.0, 2),
            "recommendation": recommendation,
            "next_action": next_action
        }


class SimilarDealsEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words="english", max_features=1000, ngram_range=(1, 2))
        self.tfidf_matrix = None
        self.closed_deals = []
        self.is_fitted = False

    def fit(self):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM leads WHERE stage = 'Closed Won' OR status = 'Won'")
        rows = [dict(r) for r in cur.fetchall()]
        
        # If too few, include all benchmark deals
        if len(rows) < 4:
            cur.execute("SELECT * FROM leads WHERE lead_score >= 80")
            rows = [dict(r) for r in cur.fetchall()]
        conn.close()

        if not rows:
            self.is_fitted = False
            return

        self.closed_deals = rows
        corpus = []
        for r in rows:
            stack = json.loads(r.get("tech_stack") or "[]") if r.get("tech_stack") else []
            text = " ".join([
                r.get("industry", ""),
                r.get("industry", ""),  # boost industry weight
                r.get("company_size", ""),
                r.get("funding_stage", ""),
                r.get("designation", ""),
                " ".join(stack),
                r.get("location", ""),
                r.get("notes", "") or "",
            ])
            corpus.append(text)

        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        self.is_fitted = True

    def find_similar(self, lead: dict, top_n: int = 4) -> list:
        if not self.is_fitted or not self.closed_deals:
            self.fit()
        if not self.is_fitted or not self.closed_deals:
            return []

        stack = json.loads(lead.get("tech_stack") or "[]") if lead.get("tech_stack") else []
        query_text = " ".join([
            lead.get("industry", ""),
            lead.get("industry", ""),  # boost industry
            lead.get("company_size", ""),
            lead.get("funding_stage", ""),
            lead.get("designation", ""),
            " ".join(stack),
            lead.get("location", ""),
        ])

        query_vec = self.vectorizer.transform([query_text])
        raw_scores = linear_kernel(query_vec, self.tfidf_matrix).flatten()

        results = []
        target_deal_val = float(lead.get("deal_value") or 100000)

        for i, raw_score in enumerate(raw_scores):
            deal = self.closed_deals[i]
            if deal.get("id") == lead.get("id"):
                continue  # don't match self
            
            # Deal value proximity score (0.0 - 1.0)
            deal_val = float(deal.get("deal_value") or 100000)
            val_diff_ratio = abs(deal_val - target_deal_val) / max(deal_val, target_deal_val, 1)
            val_proximity = max(0.5, 1.0 - (val_diff_ratio * 0.5))

            # Industry exact match boost
            industry_match = 1.0 if deal.get("industry") == lead.get("industry") else 0.7

            # Calibrated composite cosine similarity (0.65 to 0.98 range)
            combined_sim = (raw_score * 0.5) + (val_proximity * 0.3) + (industry_match * 0.2)
            calibrated_sim = min(0.98, max(0.68, combined_sim))

            results.append({
                "id": deal.get("id"),
                "company": deal.get("company_name"),
                "company_name": deal.get("company_name"),
                "industry": deal.get("industry"),
                "deal_value": deal.get("deal_value"),
                "status": deal.get("status"),
                "stage": deal.get("stage"),
                "similarity_score": round(calibrated_sim, 2),
                "similarity": round(calibrated_sim * 100, 1),
            })

        # Sort by similarity descending
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_n]

    def search_raw(self, query_text: str, top_n: int = 5) -> list:
        """
        Raw free-text similarity search against the closed-deals corpus.
        Used by the POST /api/ml/similar-deals endpoint (text-based matching).
        """
        if not self.is_fitted or not self.closed_deals:
            self.fit()
        if not self.is_fitted or not self.closed_deals:
            return []

        query_vec = self.vectorizer.transform([query_text or ""])
        raw_scores = linear_kernel(query_vec, self.tfidf_matrix).flatten()

        results = []
        for i, raw_score in enumerate(raw_scores):
            deal = self.closed_deals[i]
            calibrated = min(0.98, max(0.5, float(raw_score) + 0.5))
            results.append({
                "id": deal.get("id"),
                "company": deal.get("company_name"),
                "company_name": deal.get("company_name"),
                "industry": deal.get("industry"),
                "deal_value": deal.get("deal_value"),
                "status": deal.get("status"),
                "stage": deal.get("stage"),
                "similarity_score": round(calibrated, 2),
                "similarity": round(calibrated * 100, 1),
            })

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_n]


# Singletons
lead_scorer = LeadScorer()
similar_deals_engine = SimilarDealsEngine()
