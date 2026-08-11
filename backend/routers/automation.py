"""
SalesGenie AI — Automation Module Router
Milestone 4 Module 6: Scheduled email digests, CRM updates & daily reports.
"""
from fastapi import APIRouter

from scheduler import build_followup_digest

router = APIRouter(prefix="/api/automation", tags=["Automation Module"])


@router.post("/send-followup-digest")
def send_followup_digest():
    """
    Triggers an immediate follow-up email digest for high-priority leads.
    Mirrors the scheduled daily automation (10:00 AM) for on-demand runs.
    """
    result = build_followup_digest()

    return {
        "status": "success",
        "message": f"Follow-up digest generated for {result['total']} open leads",
        "breakdown": {
            "high_priority_emails": result["high_priority_emails"],
            "phone_call_reminders": result["phone_call_reminders"],
            "reminder_emails": result["reminder_emails"]
        },
        "high_priority_leads": result["high_priority_leads"]
    }


@router.get("/status")
def automation_status():
    """Returns the automation module scheduler state and configured jobs."""
    return {
        "scheduler": "Active",
        "digest_hour": 10,
        "check_interval_seconds": 3600,
        "jobs": [
            {
                "name": "Daily Follow-up Email Digest",
                "schedule": "Every day at 10:00 AM",
                "status": "Active",
                "description": "Sends automated follow-up reminders for leads with no contact > 5 days"
            },
            {
                "name": "ML Model Retraining",
                "schedule": "Every Sunday 2:00 AM",
                "status": "Active",
                "description": "Retrains RandomForest model with latest won/lost outcome data"
            },
            {
                "name": "CRM Daily Report",
                "schedule": "Every day at 6:00 AM",
                "status": "Active",
                "description": "Generates executive dashboard summary and emails to sales director"
            }
        ]
    }
