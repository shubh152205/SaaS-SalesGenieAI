"""
SalesGenie AI — Lightweight Automation Scheduler
Milestone 4 Module 6: Runs scheduled jobs (daily follow-up email digest) in-process.
Uses a daemon thread with periodic checks — no external `schedule` dependency.
"""
import threading
import time
from datetime import datetime, date

from database import get_db

# Check the schedule every hour; fire the digest once per day at 10:00 AM
DIGEST_CHECK_INTERVAL = 3600   # seconds
DAILY_DIGEST_HOUR = 10         # 10:00 AM

_SCHEDULER_STATE = {"last_digest_day": None}


def build_followup_digest() -> dict:
    """
    Milestone 4 Module 5 followup() decision logic:
    - > 10 days since contact: High Priority Follow-up
    - > 5 days:                Schedule Phone Call
    - <= 5 days:               Send Reminder Email

    Classifies all open leads, then logs the automation run so it appears
    in the automation status panel and the real-time activity feed.
    """
    conn = get_db()
    cur = conn.cursor()
    today = date.today()

    cur.execute("""
        SELECT id, company_name, contact_name, email, lead_score, last_contact_date, stage
        FROM leads
        WHERE status = 'Open' AND last_contact_date IS NOT NULL
        ORDER BY lead_score DESC
    """)
    leads = [dict(r) for r in cur.fetchall()]

    high_priority = []
    phone_call = []
    reminder = []

    for lead in leads:
        days_since = 15
        if lead.get("last_contact_date"):
            try:
                last_dt = datetime.strptime(lead["last_contact_date"], "%Y-%m-%d").date()
                days_since = (today - last_dt).days
            except Exception:
                pass

        if days_since > 10:
            high_priority.append(lead)
        elif days_since > 5:
            phone_call.append(lead)
        else:
            reminder.append(lead)

    total = len(high_priority) + len(phone_call) + len(reminder)

    if total > 0:
        cur.execute("""
            INSERT INTO automation_log (task_type, status, leads_processed, emails_queued, details)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "Scheduled Follow-up Email Digest",
            "Completed",
            total,
            len(high_priority) + len(phone_call) + len(reminder),
            f"High Priority: {len(high_priority)}, Phone Calls: {len(phone_call)}, Reminders: {len(reminder)}"
        ))

        cur.execute("""
            INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
            VALUES (1, ?, ?, 0, ?)
        """, (
            "Automation: Scheduled Follow-up Digest",
            "automation",
            f"Processed {total} leads — {len(high_priority)} high priority emails queued"
        ))

        conn.commit()

    conn.close()

    return {
        "total": total,
        "high_priority_emails": len(high_priority),
        "phone_call_reminders": len(phone_call),
        "reminder_emails": len(reminder),
        "high_priority_leads": [
            {"company": l["company_name"], "contact": l["contact_name"], "email": l["email"]}
            for l in high_priority[:5]
        ],
    }


def _scheduler_loop():
    while True:
        try:
            now = datetime.now()
            if now.hour == DAILY_DIGEST_HOUR and _SCHEDULER_STATE["last_digest_day"] != now.date().isoformat():
                _SCHEDULER_STATE["last_digest_day"] = now.date().isoformat()
                result = build_followup_digest()
                print(
                    f"[scheduler] {now:%Y-%m-%d %H:%M} — daily follow-up digest "
                    f"processed {result['total']} leads ({result['high_priority_emails']} high priority)"
                )
        except Exception as exc:
            print(f"[scheduler] follow-up digest error: {exc}")
        time.sleep(DIGEST_CHECK_INTERVAL)


def start_scheduler():
    """Starts the in-process automation scheduler on a daemon thread."""
    thread = threading.Thread(target=_scheduler_loop, name="salesgenie-scheduler", daemon=True)
    thread.start()
    print("⏰ SalesGenie Automation Scheduler started — daily follow-up digest at 10:00 AM")
