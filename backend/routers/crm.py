import json
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from database import get_db
from models.schemas import LeadCreate, LeadStageUpdate, LeadResponse
from ml.engine import lead_scorer

router = APIRouter(prefix="/api/crm", tags=["CRM & Leads"])

PLATFORM_INTEGRATION_STACK = {"Python", "FastAPI", "React", "AWS", "PostgreSQL", "Kafka", "Snowflake", "Docker", "Kubernetes", "Redis", "TypeScript"}


def _identify_decision_maker(designation: str) -> dict:
    des = (designation or "").lower()
    if any(k in des for k in ["cto", "chief architect", "vp engineering", "vp tech", "head of engineering"]):
        return {"category": "Technical Decision Maker", "badge": "CTO / Eng Lead", "authority": "High"}
    elif any(k in des for k in ["ciso", "security architect", "vp security"]):
        return {"category": "Security Decision Maker", "badge": "CISO / Security", "authority": "High"}
    elif any(k in des for k in ["ceo", "founder", "co-founder", "president"]):
        return {"category": "Executive Decision Maker", "badge": "CEO / Founder", "authority": "Ultimate"}
    elif any(k in des for k in ["cfo", "vp finance", "treasury"]):
        return {"category": "Financial Decision Maker", "badge": "CFO / Finance", "authority": "Budget"}
    elif any(k in des for k in ["vp sales", "head of growth", "cpo", "vp product"]):
        return {"category": "Business Decision Maker", "badge": "Sales & Product", "authority": "High"}
    return {"category": "Operational Influencer", "badge": "Manager / Lead", "authority": "Medium"}


def _calculate_tech_alignment(tech_stack_list: list) -> dict:
    lead_stack_set = set(tech_stack_list)
    matched = lead_stack_set.intersection(PLATFORM_INTEGRATION_STACK)
    pct = round((len(matched) / max(1, len(lead_stack_set))) * 100, 1) if lead_stack_set else 0
    return {
        "matched_technologies": list(matched),
        "total_prospect_tech": list(lead_stack_set),
        "alignment_percentage": min(100.0, pct),
        "is_compatible": len(matched) >= 2
    }


@router.get("/leads")
def get_leads(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    industry: Optional[str] = None,
    stage: Optional[str] = None,
    country: Optional[str] = None,
    status: Optional[str] = None
):
    conn = get_db()
    cur = conn.cursor()

    query = "SELECT * FROM leads WHERE 1=1"
    params = []

    if search:
        s = f"%{search.lower()}%"
        query += " AND (LOWER(company_name) LIKE ? OR LOWER(contact_name) LIKE ? OR LOWER(industry) LIKE ? OR LOWER(location) LIKE ? OR LOWER(tech_stack) LIKE ?)"
        params.extend([s, s, s, s, s])

    if industry and industry != "All":
        query += " AND industry = ?"
        params.append(industry)

    if stage and stage != "All":
        query += " AND stage = ?"
        params.append(stage)

    if country and country != "All":
        query += " AND country = ?"
        params.append(country)

    if status and status != "All":
        query += " AND status = ?"
        params.append(status)

    # Count total matching
    count_cur = conn.cursor()
    count_query = query.replace("SELECT * FROM leads", "SELECT COUNT(*) FROM leads")
    count_cur.execute(count_query, params)
    total_count = count_cur.fetchone()[0]

    query += " ORDER BY deal_value DESC, lead_score DESC LIMIT ? OFFSET ?"
    params.extend([limit, (page - 1) * limit])

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        d["tech_stack"] = json.loads(d["tech_stack"] or "[]") if d.get("tech_stack") else []
        d["decision_maker"] = _identify_decision_maker(d.get("designation", ""))
        d["tech_alignment"] = _calculate_tech_alignment(d["tech_stack"])
        result.append(d)

    return {
        "items": result,
        "total": total_count,
        "page": page,
        "limit": limit,
        "pages": (total_count + limit - 1) // limit
    }


@router.get("/leads/{lead_id}")
def get_lead_by_id(lead_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")

    d = dict(row)
    d["tech_stack"] = json.loads(d["tech_stack"] or "[]") if d.get("tech_stack") else []
    d["decision_maker"] = _identify_decision_maker(d.get("designation", ""))
    d["tech_alignment"] = _calculate_tech_alignment(d["tech_stack"])
    return d


@router.post("/leads")
def create_lead(lead: LeadCreate):
    conn = get_db()
    cur = conn.cursor()

    # Pre-calculate lead score using ML
    score_res = lead_scorer.predict(
        email_opens=lead.email_opens,
        website_visits=lead.website_visits,
        demo_requested=lead.demo_requested,
        company_size=lead.company_size or "Medium",
        industry=lead.industry,
        funding_stage=lead.funding_stage or "Series A",
        days_since_contact=0
    )

    stack_json = json.dumps(lead.tech_stack or [])

    cur.execute("""
        INSERT INTO leads (
            company_name, contact_name, designation, email, phone, industry,
            company_size, annual_revenue, location, funding_stage, tech_stack,
            email_opens, website_visits, demo_requested, last_contact_date,
            stage, deal_value, status, lead_score, recommendation, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'), ?, ?, ?, ?, ?, ?)
    """, (
        lead.company_name, lead.contact_name, lead.designation, lead.email, lead.phone,
        lead.industry, lead.company_size, lead.annual_revenue, lead.location,
        lead.funding_stage, stack_json, lead.email_opens, lead.website_visits,
        lead.demo_requested, lead.stage, lead.deal_value, lead.status,
        score_res["score"], score_res["recommendation"], lead.notes
    ))
    new_id = cur.lastrowid

    cur.execute(
        "INSERT INTO activity_log (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)",
        ("Created New B2B SaaS Lead", "lead", new_id, f"Added {lead.company_name} (${lead.deal_value:,})")
    )

    conn.commit()
    conn.close()

    return {"id": new_id, "message": "Lead created successfully", "lead_score": score_res["score"], "recommendation": score_res["recommendation"]}


@router.patch("/leads/{lead_id}/stage")
def update_lead_stage(lead_id: int, update: LeadStageUpdate):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT company_name, stage, deal_value FROM leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Lead not found")

    new_status = "Won" if update.stage == "Closed Won" else ("Lost" if update.stage == "Closed Lost" else "Open")

    cur.execute("UPDATE leads SET stage = ?, status = ? WHERE id = ?", (update.stage, new_status, lead_id))
    cur.execute(
        "INSERT INTO activity_log (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)",
        (f"Moved stage to {update.stage}", "pipeline", lead_id, f"{row['company_name']} advanced from {row['stage']} to {update.stage}")
    )
    conn.commit()
    conn.close()

    return {"id": lead_id, "stage": update.stage, "status": new_status}


@router.get("/pipeline")
def get_pipeline():
    conn = get_db()
    cur = conn.cursor()
    
    # M4 Stage model: New Lead → Qualified → Proposal → Negotiation → Closed Won
    stages = ["New Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"]
    pipeline_res = []
    
    for st in stages:
        cur.execute("SELECT id, company_name, contact_name, industry, deal_value, lead_score, stage, status FROM leads WHERE stage = ? ORDER BY deal_value DESC", (st,))
        deals = [dict(r) for r in cur.fetchall()]
        pipeline_res.append({
            "stage": st,
            "count": len(deals),
            "total_value": sum(d.get("deal_value", 0) for d in deals),
            "deals": deals
        })
    
    conn.close()
    return {"pipeline": pipeline_res}


@router.patch("/deals/{deal_id}/stage")
def update_deal_stage_alias(deal_id: int, update: LeadStageUpdate):
    return update_lead_stage(deal_id, update)


@router.delete("/leads/{lead_id}")
def delete_lead(lead_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
    conn.commit()
    conn.close()
    return {"message": "Lead deleted successfully"}
