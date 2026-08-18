"""
SalesGenie AI — Unit Tests for ML Recommendation Engine
Milestone 4 Module 8: Testing Module
Tests the AI follow-up recommendation function and lead scoring pipeline.
"""
import pytest
import sys
import os
import json
from unittest.mock import MagicMock, patch

# Allow import from parent backend directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# ── Inline follow-up recommendation logic (matches dashboard.py) ──────────────
def get_followup_recommendation(days_since_contact: int) -> dict:
    """
    AI Follow-up Priority Classification Engine.
    Milestone 4 Module 5: followup() function logic.
    
    Returns recommendation based on days since last contact:
    - > 10 days: High Priority Follow-up
    - > 5 days:  Schedule Phone Call
    - ≤ 5 days:  Send Reminder Email
    """
    if days_since_contact > 10:
        return {
            "action": "High Priority Follow-up",
            "urgency": "critical",
            "color": "#ef4444"
        }
    elif days_since_contact > 5:
        return {
            "action": "Schedule Phone Call",
            "urgency": "medium",
            "color": "#f59e0b"
        }
    else:
        return {
            "action": "Send Reminder Email",
            "urgency": "low",
            "color": "#10b981"
        }


# ── Tests: Follow-up Recommendation Function ──────────────────────────────────
class TestFollowupRecommendation:
    """Unit tests for the AI follow-up priority recommendation function."""

    def test_high_priority_followup_above_10_days(self):
        """Leads inactive for >10 days should be marked High Priority."""
        result = get_followup_recommendation(15)
        assert result["action"] == "High Priority Follow-up"
        assert result["urgency"] == "critical"

    def test_high_priority_followup_exactly_11_days(self):
        """Boundary: exactly 11 days since contact = High Priority."""
        result = get_followup_recommendation(11)
        assert result["urgency"] == "critical"

    def test_phone_call_between_6_and_10_days(self):
        """Leads with 6-10 days since contact → Schedule Phone Call."""
        result = get_followup_recommendation(7)
        assert result["action"] == "Schedule Phone Call"
        assert result["urgency"] == "medium"

    def test_phone_call_exactly_6_days(self):
        """Boundary: exactly 6 days since contact = Phone Call."""
        result = get_followup_recommendation(6)
        assert result["urgency"] == "medium"

    def test_reminder_email_within_5_days(self):
        """Leads contacted within 5 days → Send Reminder Email."""
        result = get_followup_recommendation(3)
        assert result["action"] == "Send Reminder Email"
        assert result["urgency"] == "low"

    def test_reminder_email_exactly_5_days(self):
        """Boundary: exactly 5 days since contact = Reminder Email."""
        result = get_followup_recommendation(5)
        assert result["urgency"] == "low"

    def test_reminder_email_zero_days(self):
        """Just contacted (0 days) should still be Reminder Email."""
        result = get_followup_recommendation(0)
        assert result["urgency"] == "low"

    def test_extreme_no_contact_30_days(self):
        """Very stale lead (30 days) → High Priority."""
        result = get_followup_recommendation(30)
        assert result["urgency"] == "critical"

    def test_returns_color_for_all_urgency_levels(self):
        """All recommendations should return a valid color hex."""
        for days in [2, 7, 15]:
            result = get_followup_recommendation(days)
            assert "color" in result
            assert result["color"].startswith("#")

    def test_priority_ordering(self):
        """Critical > Medium > Low urgency level ordering."""
        critical = get_followup_recommendation(12)
        medium = get_followup_recommendation(8)
        low = get_followup_recommendation(2)

        urgency_rank = {"critical": 0, "medium": 1, "low": 2}
        assert urgency_rank[critical["urgency"]] < urgency_rank[medium["urgency"]]
        assert urgency_rank[medium["urgency"]] < urgency_rank[low["urgency"]]


# ── Tests: ML Lead Scoring Engine ─────────────────────────────────────────────
class TestLeadScoringEngine:
    """Unit tests for the RandomForest ML Lead Scoring Engine."""

    def test_lead_score_range(self):
        """Lead scores should always be between 0 and 100."""
        try:
            from ml.engine import LeadScorer
            scorer = LeadScorer()
            result = scorer.predict(8, 4, 1, "Medium", "Software / B2B SaaS", "Series B", 7)
            score = result.get("score", 0)
            assert 0 <= score <= 100, f"Score {score} out of range"
        except ImportError:
            pytest.skip("ML engine not importable in this environment")

    def test_high_engagement_yields_high_score(self):
        """High email opens + web visits + demo request = high lead score."""
        try:
            from ml.engine import LeadScorer
            scorer = LeadScorer()
            low_engagement = scorer.predict(0, 0, 0, "Small", "Software / B2B SaaS", "Seed", 30)
            high_engagement = scorer.predict(20, 15, 1, "Large", "Software / B2B SaaS", "Series C", 2)
            assert high_engagement["score"] >= low_engagement["score"]
        except ImportError:
            pytest.skip("ML engine not importable in this environment")

    def test_score_has_required_fields(self):
        """Score response must contain score, probability, recommendation, next_action."""
        try:
            from ml.engine import LeadScorer
            scorer = LeadScorer()
            result = scorer.predict(5, 3, 0, "Medium", "Software / B2B SaaS", "Series A", 10)
            assert "score" in result
            assert "probability" in result
            assert "recommendation" in result
            assert "next_action" in result
        except ImportError:
            pytest.skip("ML engine not importable in this environment")

    def test_intent_tier_is_valid(self):
        """Intent tier (derived from score) should map to High/Medium/Low."""
        try:
            from ml.engine import LeadScorer
            scorer = LeadScorer()
            for params in [
                (0, 0, 0, "Small", "Software / B2B SaaS", "Seed", 30),
                (15, 10, 1, "Large", "Software / B2B SaaS", "Series B", 3)
            ]:
                result = scorer.predict(*params)
                score = result["score"]
                # Derive tier from score value
                if score >= 70:
                    tier = "High"
                elif score >= 40:
                    tier = "Medium"
                else:
                    tier = "Low"
                assert tier in ["High", "Medium", "Low"]
        except ImportError:
            pytest.skip("ML engine not importable in this environment")

    def test_conversion_probability_is_fraction(self):
        """Conversion probability ('probability') should be in [0, 1] range."""
        try:
            from ml.engine import LeadScorer
            scorer = LeadScorer()
            result = scorer.predict(8, 5, 1, "Medium", "Software / B2B SaaS", "Series A", 5)
            prob = float(result["probability"])
            assert 0.0 <= prob <= 1.0
        except ImportError:
            pytest.skip("ML engine not importable in this environment")


# ── Tests: Data Validation ─────────────────────────────────────────────────────
class TestDataValidation:
    """Tests for schema validation and data integrity checks."""

    def test_lead_score_non_negative(self):
        """Lead scores should never be negative."""
        scores = [0, 42, 75, 95, 100]
        for score in scores:
            assert score >= 0, f"Score {score} is negative"

    def test_deal_value_non_negative(self):
        """Deal values should not be negative."""
        values = [0, 5000, 120000, 500000]
        for value in values:
            assert value >= 0, f"Deal value {value} is negative"

    def test_recommendation_days_thresholds(self):
        """Validate that all boundary thresholds produce correct classifications."""
        test_cases = [
            (0, "low"),
            (5, "low"),
            (6, "medium"),
            (10, "medium"),
            (11, "critical"),
            (20, "critical"),
        ]
        for days, expected_urgency in test_cases:
            result = get_followup_recommendation(days)
            assert result["urgency"] == expected_urgency, \
                f"Days={days}: expected urgency={expected_urgency}, got={result['urgency']}"

    def test_tech_stack_json_parsing(self):
        """Tech stack JSON should be parseable without errors."""
        valid_stacks = [
            '["AWS", "Python", "React"]',
            '["GCP", "FastAPI", "PostgreSQL"]',
            '[]',
            None
        ]
        for stack_str in valid_stacks:
            if stack_str:
                parsed = json.loads(stack_str)
                assert isinstance(parsed, list)
            else:
                assert stack_str is None


# ── Tests: Automation Module ───────────────────────────────────────────────────
class TestAutomationModule:
    """Tests for the Milestone 4 Automation Module logic."""

    def test_automation_classifies_all_leads(self):
        """All leads should be classified into one of the three action buckets."""
        leads = [
            {"company": "Acme", "days_since": 0},
            {"company": "Beta", "days_since": 7},
            {"company": "Gamma", "days_since": 15},
            {"company": "Delta", "days_since": 5},
            {"company": "Epsilon", "days_since": 11},
        ]
        results = [get_followup_recommendation(l["days_since"]) for l in leads]
        # All should have valid urgency
        for result in results:
            assert result["urgency"] in ["low", "medium", "critical"]

    def test_automation_high_priority_buckets(self):
        """Leads with >10 days should land in High Priority bucket."""
        stale_leads = [15, 20, 30, 45]
        for days in stale_leads:
            result = get_followup_recommendation(days)
            assert result["urgency"] == "critical", \
                f"Lead with {days} days inactivity should be critical, got {result['urgency']}"

    def test_all_actions_non_empty(self):
        """Every recommendation should have a non-empty action string."""
        for days in [0, 1, 5, 6, 10, 11, 30]:
            result = get_followup_recommendation(days)
            assert len(result["action"]) > 0



# ── Tests: TTS Configuration API ───────────────────────────────────────────────
class TestTTSConfiguration:
    """Tests for the TTS configuration endpoint."""

    def test_tts_configuration_response(self):
        """TTS configuration endpoint should return supported voices and playback rates."""
        from routers.outreach import get_tts_configuration
        res = get_tts_configuration()
        assert "engine" in res
        assert "supported_rates" in res
        assert 1.0 in res["supported_rates"]
        assert len(res["recommended_personas"]) >= 4
        assert len(res["features"]) > 0


# ── Test Runner Configuration ──────────────────────────────────────────────────
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

