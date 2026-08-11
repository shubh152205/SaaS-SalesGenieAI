from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: str


# ── Leads ─────────────────────────────────────────────────────────────────────
class LeadBase(BaseModel):
    company_name: str
    contact_name: str
    designation: str
    email: Optional[str] = None
    phone: Optional[str] = None
    industry: str
    company_size: Optional[str] = None
    annual_revenue: Optional[str] = None
    location: Optional[str] = None
    funding_stage: Optional[str] = None
    tech_stack: Optional[List[str]] = []
    email_opens: int = 0
    website_visits: int = 0
    demo_requested: int = 0
    last_contact_date: Optional[str] = None
    stage: str = "New Lead"
    deal_value: int = 0
    status: str = "Open"
    notes: Optional[str] = None


class LeadCreate(LeadBase):
    pass


class LeadResponse(LeadBase):
    id: int
    created_at: str
    lead_score: Optional[float] = None
    recommendation: Optional[str] = None


class LeadStageUpdate(BaseModel):
    stage: str


# ── ML ────────────────────────────────────────────────────────────────────────
class ScoreRequest(BaseModel):
    email_opens: int = 0
    website_visits: int = 0
    demo_requested: int = 0
    company_size: str = "Medium"
    industry: str = "Software"
    funding_stage: str = "Series A"
    days_since_contact: int = 7


class ScoreResponse(BaseModel):
    score: float
    probability: float
    recommendation: str
    next_action: str


class SimilarDealRequest(BaseModel):
    lead_id: int


# ── Outreach ──────────────────────────────────────────────────────────────────
class OutreachRequest(BaseModel):
    lead_id: int
    message_type: str = "cold_email"  # cold_email | followup | linkedin


class OutreachResponse(BaseModel):
    subject: Optional[str] = None
    message: str
    strategy: Optional[str] = None


# ── Meetings ──────────────────────────────────────────────────────────────────
class MeetingRequest(BaseModel):
    lead_id: Optional[int] = None
    transcript: str


class MeetingResponse(BaseModel):
    id: int
    lead_name: Optional[str] = None
    summary: str
    action_items: List[str]
    sentiment: str
    sentiment_score: float
    created_at: str


# ── Dashboard ─────────────────────────────────────────────────────────────────
class KPIResponse(BaseModel):
    total_leads: int
    hot_leads: int
    conversion_rate: float
    pipeline_value: int
    avg_deal_value: int
    open_deals: int
    avg_response_time: float = 2.4       # M4: Hours to first response
    avg_sales_cycle: int = 28            # M4: Average days to close
    won_leads: int = 0
    lost_leads: int = 0


class FunnelStage(BaseModel):
    stage: str
    count: int
    value: int


class ActivityItem(BaseModel):
    id: int
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    created_at: str
