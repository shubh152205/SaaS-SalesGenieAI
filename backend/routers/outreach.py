import json
from fastapi import APIRouter, HTTPException
from database import get_db
from models.schemas import OutreachRequest, OutreachResponse
from services.nim_client import call_nim

router = APIRouter(prefix="/api/outreach", tags=["AI Outreach Engine"])

INDUSTRY_STRATEGIES = {
    "Software / B2B SaaS": {
        "channel_mix": ["Email (Executive)", "LinkedIn InMail", "Live Technical Demo"],
        "timing": "Follow up within 48 hours",
        "value_prop": "Accelerate B2B SaaS sales cycles by 65% with agentic outreach and predictive lead scoring.",
        "case_study": "Enterprise SaaS scaled outbound velocity by 3.2x in 60 days."
    },
    "Artificial Intelligence": {
        "channel_mix": ["Technical Deep-Dive", "Email", "GitHub / Slack Community"],
        "timing": "Follow up within 24 hours",
        "value_prop": "Native API and LLM orchestration for automated sales call intelligence.",
        "case_study": "AI infrastructure provider reduced customer acquisition cost by 40%."
    },
    "Cloud Infrastructure": {
        "channel_mix": ["Architecture Whitepaper", "LinkedIn", "Executive Briefing"],
        "timing": "Follow up within 3 days",
        "value_prop": "Seamless multi-cloud orchestration and SOC2 Type II compliant sales data infrastructure.",
        "case_study": "Cloud platform achieved 98% lead qualification accuracy."
    },
    "FinTech SaaS": {
        "channel_mix": ["Security & Compliance Overview", "Email", "Phone Follow-up"],
        "timing": "Follow up within 48 hours",
        "value_prop": "Bank-grade security, automated KYC lead qualification, and real-time revenue analytics.",
        "case_study": "FinTech leader streamlined compliance review from 3 weeks to 2 days."
    },
    "Cybersecurity SaaS": {
        "channel_mix": ["CISO Briefing", "Encrypted Outreach", "In-depth Technical Demo"],
        "timing": "Follow up within 48 hours",
        "value_prop": "Zero-trust sales intelligence and automated threat profile enrichment.",
        "case_study": "Cybersecurity firm closed 4 enterprise accounts in Q2."
    },
    "HealthTech SaaS": {
        "channel_mix": ["HIPAA Compliance Overview", "Email", "Webinar Invitation"],
        "timing": "Follow up within 3-5 days",
        "value_prop": "HIPAA & FHIR compliant patient and clinician workflow sales acceleration.",
        "case_study": "HealthTech company increased pilot adoption by 50%."
    }
}


@router.post("/generate-email", response_model=OutreachResponse)
async def generate_cold_email(req: OutreachRequest):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (req.lead_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead = dict(row)
    stack = json.loads(lead.get("tech_stack") or "[]") if lead.get("tech_stack") else []
    stack_str = ", ".join(stack)

    system_prompt = (
        "You are SalesGenie AI, a senior B2B SaaS enterprise SDR and sales engineer. "
        "Your mission is to write hyper-personalized, high-converting B2B cold emails tailored to software executives. "
        "Tone: Professional, consultative, concise, and value-driven. Avoid hype and buzzwords."
    )

    user_prompt = f"""
Write a personalized B2B SaaS cold email for the following prospect:
- Contact Name: {lead['contact_name']}
- Designation: {lead['designation']}
- Company Name: {lead['company_name']}
- Industry: {lead['industry']}
- Annual Revenue: {lead['annual_revenue']}
- Funding Stage: {lead['funding_stage']} (Mention their recent growth or funding milestone if applicable)
- Existing Tech Stack: {stack_str}
- Location: {lead['location']}, {lead['country']}
- Known Notes / Pain Point: {lead.get('notes', 'Managing high-volume sales pipelines')}

Key Requirements:
1. Include a compelling, clickable subject line starting with 'Subject: ...'
2. Congratulate them on their growth / funding round in {lead['funding_stage']} if applicable.
3. Explicitly reference their tech stack ({stack_str}) and show how our AI Sales Intelligence Platform natively integrates.
4. Highlight how our platform helps software organizations reduce sales outreach time by 65% and predict high-converting leads.
5. End with a low-friction call-to-action requesting a brief 15-minute discovery call next week.
"""

    response_text = await call_nim(user_prompt, system_prompt=system_prompt, max_tokens=600)
    
    # Extract subject if present
    subject = "Transforming Sales Pipeline & Outreach Velocity with AI"
    body = response_text
    if "Subject:" in response_text:
        parts = response_text.split("Subject:", 1)[1].split("\n", 1)
        subject = parts[0].strip()
        body = parts[1].strip() if len(parts) > 1 else response_text

    strategy_info = INDUSTRY_STRATEGIES.get(lead["industry"], INDUSTRY_STRATEGIES["Software / B2B SaaS"])

    return OutreachResponse(
        subject=subject,
        message=body,
        strategy=strategy_info["value_prop"]
    )


@router.post("/generate-followup", response_model=OutreachResponse)
async def generate_followup(req: OutreachRequest):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (req.lead_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead = dict(row)

    system_prompt = "You are SalesGenie AI. Write a punchy, high-converting follow-up email for a software decision maker."
    user_prompt = f"""
Write a polite, value-driven follow-up sales email for:
- Name: {lead['contact_name']} ({lead['designation']} at {lead['company_name']})
- Industry: {lead['industry']}
- Tech: {lead.get('tech_stack', '')}

Requirements:
- Subject line starting with 'Subject: ...'
- Reference previous note, share a quick metric on 65% time reduction in sales workflows.
- Ask for 10 minutes this week for a short walkthrough.
"""

    response_text = await call_nim(user_prompt, system_prompt=system_prompt, max_tokens=400)

    subject = f"Re: Improving Sales Velocity at {lead['company_name']}"
    body = response_text
    if "Subject:" in response_text:
        parts = response_text.split("Subject:", 1)[1].split("\n", 1)
        subject = parts[0].strip()
        body = parts[1].strip() if len(parts) > 1 else response_text

    return OutreachResponse(
        subject=subject,
        message=body,
        strategy="Follow-up cadence within 48-72 hours"
    )


@router.post("/generate-linkedin", response_model=OutreachResponse)
async def generate_linkedin(req: OutreachRequest):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (req.lead_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead = dict(row)
    user_prompt = f"""
Write a short, engaging LinkedIn connection note (< 300 characters) for:
- Contact: {lead['contact_name']}
- Role: {lead['designation']} at {lead['company_name']}
- Industry: {lead['industry']}
Focus on sharing peer insights on AI sales automation.
"""
    msg = await call_nim(user_prompt, max_tokens=150)
    return OutreachResponse(
        subject="LinkedIn Connection",
        message=msg.strip(),
        strategy="Multi-channel social touchpoint"
    )


@router.post("/generate-outreach")
async def generate_outreach_alias(payload: dict):
    lead_id = payload.get("lead_id", 1)
    tone = payload.get("tone", "Consultative & ROI-Focused")
    outreach_type = payload.get("outreach_type", "cold_email")
    model = payload.get("model", "meta/llama-3.1-8b-instruct")
    temperature = float(payload.get("temperature", 0.3))
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
    conn.close()
    
    if not row:
        lead = {"company_name": "Acme Corp", "contact_name": "Executive Decision Maker", "industry": "Software / B2B SaaS", "funding_stage": "Series B", "location": "San Francisco, CA", "country": "USA", "deal_value": 140000, "tech_stack": '["AWS", "Python", "React"]'}
    else:
        lead = dict(row)
        
    stack = json.loads(lead.get("tech_stack") or "[]") if lead.get("tech_stack") else []
    stack_str = ", ".join(stack) if stack else "AWS, Python, React, PostgreSQL"

    system_prompt = (
        f"You are SalesGenie AI, an elite B2B enterprise SDR and sales strategist. "
        f"Generate a hyper-personalized {outreach_type} with a {tone} tone using {model}. "
        f"Focus on real-world value: 65% faster outreach, 3.2x pipeline velocity, and predictive lead scoring."
    )
    user_prompt = f"""
Write a personalized {outreach_type} to:
- Contact Name: {lead.get('contact_name', 'Executive')}
- Designation: {lead.get('designation', 'VP of Engineering')}
- Company Name: {lead.get('company_name', 'B2B Enterprise')}
- Industry: {lead.get('industry', 'Software / B2B SaaS')}
- Funding Stage: {lead.get('funding_stage', 'Series B')}
- Tech Stack: {stack_str}
- Location: {lead.get('location', 'Global')}, {lead.get('country', 'USA')}
- Deal Scope: ${lead.get('deal_value', 120000):,}
- Notes: {lead.get('notes', 'Scaling sales pipeline workflows')}

Requirements:
1. Subject line starting with 'Subject: ...' (compelling, executive-level).
2. Congratulate them on recent growth in {lead.get('funding_stage', 'Series B')}.
3. Reference their tech stack ({stack_str}) and show how our AI Sales Intelligence natively connects.
4. Highlight 65% time reduction and 120-tree Random Forest predictive lead scoring.
5. End with a clear, low-friction 15-minute introductory call request.
"""
    
    response_text = await call_nim(
        user_prompt,
        system_prompt=system_prompt,
        model=model,
        max_tokens=600,
        temperature=temperature
    )
    
    subject = f"Accelerating {lead['company_name']} Pipeline Velocity with AI & Predictive Scoring"
    body = response_text
    if "Subject:" in response_text:
        parts = response_text.split("Subject:", 1)[1].split("\n", 1)
        subject = parts[0].strip()
        body = parts[1].strip() if len(parts) > 1 else response_text
        
    return {
        "subject": subject,
        "body": body,
        "content": body,
        "model": model,
        "strategy": f"NVIDIA NIM {model} synthesis with {tone} tone"
    }


@router.get("/strategy/{lead_id}")
def get_strategy(lead_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead = dict(row)
    strat = INDUSTRY_STRATEGIES.get(lead["industry"], INDUSTRY_STRATEGIES["Software / B2B SaaS"])
    return {
        "lead_id": lead_id,
        "company_name": lead["company_name"],
        "industry": lead["industry"],
        "channel_mix": strat["channel_mix"],
        "timing": strat["timing"],
        "value_prop": strat["value_prop"],
        "case_study": strat["case_study"]
    }


@router.get("/tts-config")
def get_tts_configuration():
    """
    Returns TTS configurations, supported voice profiles, and playback rates.
    """
    return {
        "engine": "SalesGenie Natural Web Speech & Neural Synthesizer",
        "supported_rates": [0.8, 1.0, 1.25, 1.5, 2.0],
        "default_rate": 1.0,
        "recommended_personas": [
            {"id": "exec_male", "name": "Enterprise Executive Male", "speed": 1.0, "pitch": 0.95},
            {"id": "exec_female", "name": "Enterprise Executive Female", "speed": 1.0, "pitch": 1.05},
            {"id": "dynamic_sdr", "name": "Dynamic Sales Rep", "speed": 1.15, "pitch": 1.0},
            {"id": "consultative", "name": "Consultative Sales Engineer", "speed": 0.95, "pitch": 0.9}
        ],
        "features": [
            "Real-time sentence synchronization and highlighting",
            "Automatic sentence chunking preventing Chrome 15s freeze",
            "Animated waveform frequency equalizer visualizer",
            "Play, pause, resume, and stop controls"
        ]
    }

