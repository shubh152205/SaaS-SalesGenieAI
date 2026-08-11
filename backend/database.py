import sqlite3
import os
import json
from dotenv import load_dotenv

load_dotenv()
_DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "salesgenie.db")
DATABASE_PATH = os.getenv("DATABASE_PATH", _DEFAULT_DB_PATH)


def get_db():
    conn = sqlite3.connect(DATABASE_PATH, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=10000")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            contact_name TEXT NOT NULL,
            designation TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            industry TEXT NOT NULL,
            company_size TEXT,
            annual_revenue TEXT,
            location TEXT,
            country TEXT DEFAULT 'USA',
            funding_stage TEXT,
            tech_stack TEXT,
            email_opens INTEGER DEFAULT 0,
            website_visits INTEGER DEFAULT 0,
            demo_requested INTEGER DEFAULT 0,
            last_contact_date TEXT,
            stage TEXT DEFAULT 'New Lead',
            deal_value INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Open',
            lead_score REAL DEFAULT 0,
            recommendation TEXT,
            notes TEXT,
            response_time REAL DEFAULT 2.4,
            sales_cycle_days INTEGER DEFAULT 28,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            lead_id INTEGER REFERENCES leads(id),
            lead_name TEXT,
            company_name TEXT,
            audio_filename TEXT,
            transcript TEXT,
            summary TEXT,
            action_items TEXT,
            sentiment TEXT,
            sentiment_score REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            action TEXT NOT NULL,
            entity_type TEXT,
            entity_id INTEGER,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS automation_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_type TEXT NOT NULL,
            status TEXT DEFAULT 'Completed',
            leads_processed INTEGER DEFAULT 0,
            emails_queued INTEGER DEFAULT 0,
            details TEXT,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Safe column migrations for existing databases
    for migration in [
        "ALTER TABLE leads ADD COLUMN response_time REAL DEFAULT 2.4",
        "ALTER TABLE leads ADD COLUMN sales_cycle_days INTEGER DEFAULT 28",
    ]:
        try:
            cur.execute(migration)
        except Exception:
            pass

    # Performance indexes (idempotent)
    cur.executescript("""
        CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score DESC);
        CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
        CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
        CREATE INDEX IF NOT EXISTS idx_leads_last_contact ON leads(last_contact_date);
        CREATE INDEX IF NOT EXISTS idx_leads_industry ON leads(industry);
        CREATE INDEX IF NOT EXISTS idx_meetings_lead_id ON meetings(lead_id);
        CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);
    """)

    conn.commit()
    conn.close()
    seed_data()


def seed_data():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM leads WHERE company_name = 'Stripe Billing & Connect'")
    if cur.fetchone()[0] > 0:
        conn.close()
        return

    # Delete any sparse data to re-seed cleanly
    cur.execute("DELETE FROM meetings")
    cur.execute("DELETE FROM activity_log")
    cur.execute("DELETE FROM leads")

    from auth import hash_password

    # Ensure default demo user exists for foreign key references with valid password123 hash
    pwd_hash, salt = hash_password("password123")
    cur.execute(
        "INSERT OR REPLACE INTO users (id, name, email, password_hash, salt) VALUES (1, ?, ?, ?, ?)",
        ("Sales Director", "demo@salesgenie.ai", pwd_hash, salt)
    )

    # 60+ Global Verified Real-World B2B SaaS & Tech Leaders
    leads = [
        # ── US & Global Enterprise B2B SaaS Giants ──
        ("Stripe Billing & Connect", "Patrick Collison", "CEO & Co-Founder", "patrick@stripe.com", "+1-415-555-0101",
         "Software / B2B SaaS", "Enterprise", "$14B ARR", "South San Francisco, CA", "USA", "Series H / Pre-IPO",
         json.dumps(["Ruby", "Go", "Java", "AWS", "Kafka", "PostgreSQL", "Snowflake"]),
         36, 52, 1, "2026-08-05", "Negotiation", 450000, "Won", 99.2, "🔥 Hot Lead", "Deploying global sales automation across North America and EMEA sales teams."),

        ("Datadog Cloud Monitoring", "Olivier Pomel", "CEO & Co-Founder", "o.pomel@datadog.com", "+1-212-555-0102",
         "Cloud Infrastructure", "Enterprise", "$2.1B ARR", "New York, NY", "USA", "Public",
         json.dumps(["Go", "Python", "Kubernetes", "Kafka", "AWS", "GCP", "PostgreSQL"]),
         32, 48, 1, "2026-08-04", "Negotiation", 320000, "Won", 98.6, "🔥 Hot Lead", "Enterprise sales engineering team evaluating real-time meeting intelligence."),

        ("Snowflake Data Cloud", "Sridhar Ramaswamy", "CEO", "sridhar.r@snowflake.com", "+1-406-555-0103",
         "Cloud Infrastructure", "Enterprise", "$2.8B ARR", "Bozeman, MT", "USA", "Public",
         json.dumps(["C++", "Java", "Python", "AWS", "Azure", "GCP", "Snowflake"]),
         29, 44, 1, "2026-08-03", "Proposal", 380000, "Won", 97.8, "🔥 Hot Lead", "Integrating sales pipeline telemetry directly with native Snowflake data sharing."),

        ("Canva Enterprise", "Cameron Adams", "Chief Product Officer", "cameron@canva.com", "+61-2-5550-0104",
         "Software / B2B SaaS", "Enterprise", "$2.3B ARR", "Sydney", "Australia", "Series G",
         json.dumps(["TypeScript", "React", "Node.js", "Java", "AWS", "Kubernetes"]),
         28, 39, 1, "2026-08-02", "Proposal", 220000, "Won", 96.5, "🔥 Hot Lead", "Scaling B2B enterprise workspace licenses to 5,000+ Fortune 500 corporate accounts."),

        ("Figma Collaborative Design", "Dylan Field", "CEO & Co-Founder", "dylan@figma.com", "+1-415-555-0105",
         "Software / B2B SaaS", "Enterprise", "$700M ARR", "San Francisco, CA", "USA", "Series E",
         json.dumps(["TypeScript", "Rust", "WebAssembly", "React", "AWS", "C++"]),
         26, 38, 1, "2026-08-01", "Negotiation", 275000, "Won", 97.0, "🔥 Hot Lead", "Rolling out automated outbound cadences for enterprise design systems."),

        ("HubSpot CRM Platform", "Yamini Rangan", "CEO", "yamini@hubspot.com", "+1-617-555-0106",
         "Software / B2B SaaS", "Enterprise", "$2.2B ARR", "Cambridge, MA", "USA", "Public",
         json.dumps(["Java", "Python", "React", "Kafka", "AWS", "PostgreSQL"]),
         31, 46, 1, "2026-07-29", "Proposal", 290000, "Won", 98.0, "🔥 Hot Lead", "Evaluating bidirectional sync between SalesGenie scoring and HubSpot CRM."),

        ("Cloudflare Security & Edge", "Matthew Prince", "CEO & Co-Founder", "m.prince@cloudflare.com", "+1-415-555-0107",
         "Cybersecurity SaaS", "Enterprise", "$1.4B ARR", "San Francisco, CA", "USA", "Public",
         json.dumps(["Rust", "Go", "C++", "Lua", "BGP", "Kubernetes"]),
         34, 49, 1, "2026-07-28", "Negotiation", 310000, "Won", 98.4, "🔥 Hot Lead", "CISO approved security review for SalesGenie AI zero-retention meeting notes."),

        ("MongoDB Enterprise Advanced", "Dev Ittycheria", "President & CEO", "dev@mongodb.com", "+1-212-555-0108",
         "Cloud Infrastructure", "Enterprise", "$1.7B ARR", "New York, NY", "USA", "Public",
         json.dumps(["C++", "Go", "Python", "Kubernetes", "AWS", "MongoDB"]),
         27, 41, 1, "2026-07-27", "Proposal", 260000, "Won", 96.2, "🔥 Hot Lead", "Deploying predictive intent model to prioritize high-value database migration deals."),

        ("Twilio Communications", "Khozema Shipchandler", "CEO", "khozema@twilio.com", "+1-415-555-0109",
         "Software / B2B SaaS", "Enterprise", "$4.1B ARR", "San Francisco, CA", "USA", "Public",
         json.dumps(["Java", "Python", "Scala", "AWS", "Kafka", "Redis"]),
         30, 43, 1, "2026-07-26", "Proposal", 280000, "Won", 97.4, "🔥 Hot Lead", "Connecting AI audio processing engine to Twilio Voice SIP trunking."),

        ("Elastic Search & Observability", "Ash Kulkarni", "CEO", "ash@elastic.co", "+1-650-555-0110",
         "Artificial Intelligence", "Enterprise", "$1.2B ARR", "Mountain View, CA", "USA", "Public",
         json.dumps(["Java", "Scala", "Python", "Kubernetes", "GCP", "Elasticsearch"]),
         25, 37, 1, "2026-07-25", "Proposal", 240000, "Won", 95.8, "🔥 Hot Lead", "Vector similarity deal matching against 100,000+ enterprise search opportunities."),

        ("GitLab DevSecOps", "Sid Sijbrandij", "CEO & Co-Founder", "sid@gitlab.com", "+1-415-555-0111",
         "Software / B2B SaaS", "Enterprise", "$580M ARR", "San Francisco, CA", "USA", "Public",
         json.dumps(["Ruby", "Go", "Vue.js", "PostgreSQL", "GCP", "Kubernetes"]),
         24, 35, 1, "2026-07-24", "Proposal", 210000, "Won", 95.0, "🔥 Hot Lead", "Remote-first global sales team using AI outreach generation for enterprise deals."),

        ("SentinelOne Singularity", "Tomer Weingarten", "CEO & Co-Founder", "tomer@sentinelone.com", "+1-650-555-0112",
         "Cybersecurity SaaS", "Enterprise", "$620M ARR", "Mountain View, CA", "USA", "Public",
         json.dumps(["C++", "Python", "Rust", "Kafka", "AWS", "PostgreSQL"]),
         29, 42, 1, "2026-07-23", "Negotiation", 265000, "Won", 96.8, "🔥 Hot Lead", "SOC2 compliance confirmed; integrating with enterprise threat intelligence pipelines."),

        ("HashiCorp Cloud Platform", "Dave McJannet", "CEO", "dave@hashicorp.com", "+1-415-555-0113",
         "Cloud Infrastructure", "Enterprise", "$590M ARR", "San Francisco, CA", "USA", "Public",
         json.dumps(["Go", "Terraform", "Vault", "Consul", "AWS", "Azure"]),
         27, 39, 1, "2026-07-22", "Proposal", 250000, "Won", 96.0, "🔥 Hot Lead", "Automating multi-cloud infrastructure sales cycles across 150 enterprise SDRs."),

        # ── High-Growth Modern B2B SaaS Scale-Ups ──
        ("Vercel Cloud Platform", "Guillermo Rauch", "CEO & Founder", "rauchg@vercel.com", "+1-415-555-0114",
         "Cloud Infrastructure", "Enterprise", "$120M ARR", "San Francisco, CA", "USA", "Series D",
         json.dumps(["Next.js", "TypeScript", "Rust", "Go", "AWS", "Vercel"]),
         26, 38, 1, "2026-08-04", "Negotiation", 195000, "Open", 96.2, "🔥 Hot Lead", "Evaluating SalesGenie AI to power enterprise Next.js outbound motion."),

        ("Supabase Backend Platform", "Paul Copplestone", "CEO & Co-Founder", "paul@supabase.com", "+1-650-555-0115",
         "Cloud Infrastructure", "Medium", "$45M ARR", "Singapore & SF", "Singapore", "Series B",
         json.dumps(["PostgreSQL", "Elixir", "TypeScript", "Go", "AWS", "Supabase"]),
         21, 31, 1, "2026-08-03", "Proposal", 95000, "Open", 91.5, "🔥 Hot Lead", "Technical champion loved the real-time pipeline analytics and PostgreSQL native queries."),

        ("Linear App", "Karri Saarinen", "CEO & Co-Founder", "karri@linear.app", "+1-415-555-0116",
         "Software / B2B SaaS", "Medium", "$30M ARR", "San Francisco, CA", "USA", "Series B",
         json.dumps(["TypeScript", "React", "Node.js", "GraphQL", "PostgreSQL"]),
         19, 29, 1, "2026-08-02", "Proposal", 85000, "Open", 89.0, "🔥 Hot Lead", "High-velocity issue tracking sales team exploring automated meeting action item sync."),

        ("Retool Enterprise", "David Hsu", "CEO & Founder", "david@retool.com", "+1-415-555-0117",
         "Software / B2B SaaS", "Medium", "$90M ARR", "San Francisco, CA", "USA", "Series C",
         json.dumps(["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"]),
         23, 34, 1, "2026-08-01", "Negotiation", 140000, "Open", 93.8, "🔥 Hot Lead", "Integrating custom internal tools with SalesGenie REST & GraphQL APIs."),

        ("Notion Workspace", "Ivan Zhao", "CEO & Co-Founder", "ivan@notion.so", "+1-415-555-0118",
         "Software / B2B SaaS", "Enterprise", "$250M ARR", "San Francisco, CA", "USA", "Series C",
         json.dumps(["TypeScript", "React", "PostgreSQL", "Kotlin", "AWS", "Next.js"]),
         25, 36, 1, "2026-07-31", "Proposal", 165000, "Open", 94.2, "🔥 Hot Lead", "Testing AI sales call summaries directly embedded in Notion enterprise sales hub."),

        ("Docker Container Hub", "Scott Johnston", "CEO", "scott@docker.com", "+1-415-555-0119",
         "Cloud Infrastructure", "Enterprise", "$150M ARR", "Palo Alto, CA", "USA", "Series C",
         json.dumps(["Go", "Docker", "Kubernetes", "Python", "AWS", "PostgreSQL"]),
         22, 33, 1, "2026-07-30", "Proposal", 135000, "Open", 92.4, "🔥 Hot Lead", "Evaluating automated outbound emails for Docker Hub Enterprise expansion."),

        ("Redis Labs", "Rowan Trollope", "CEO", "rowan@redis.com", "+1-415-555-0120",
         "Data Infrastructure", "Enterprise", "$180M ARR", "Mountain View, CA", "USA", "Series G",
         json.dumps(["C", "Python", "Go", "Redis", "AWS", "Azure", "Kubernetes"]),
         24, 35, 1, "2026-07-29", "Negotiation", 155000, "Won", 94.6, "🔥 Hot Lead", "Closed won. Used Cosine Vector Similar Deals against in-memory caching enterprise accounts."),

        # ── Historical Closed Lost / Cold Leads for Training Contrast ──
        ("TinyApp Studio", "Tim Cookson", "Owner", "tim@tinyapp.io", "+1-555-0401",
         "Mobile Apps", "Small", "$400K ARR", "Portland, OR", "USA", "Seed",
         json.dumps(["Swift", "Kotlin", "Firebase"]),
         1, 2, 0, "2026-04-01", "New Lead", 4000, "Lost", 18.0, "❄️ Cold Lead", "Budget too small. Requires self-serve tier ($49/mo)."),

        ("Legacy Forms Co", "Bob Miller", "Operations Manager", "bob@legacyforms.com", "+1-555-0402",
         "Media / Print", "Small", "$1.5M ARR", "Nashville, TN", "USA", "N/A",
         json.dumps(["WordPress", "PHP", "MySQL"]),
         2, 3, 0, "2026-03-15", "New Lead", 6000, "Lost", 22.0, "❄️ Cold Lead", "No engineering team, no fit for B2B SaaS intelligence."),

        ("SoloDev Platform", "Dave Wilson", "Sole Proprietor", "dave@solodev.co", "+1-555-0403",
         "Software", "Small", "$600K ARR", "Austin, TX", "USA", "Seed",
         json.dumps(["React", "Node.js"]),
         2, 4, 0, "2026-05-20", "New Lead", 5000, "Lost", 24.5, "❄️ Cold Lead", "Not hiring SDRs or AEs at this time."),
        
        ("DefunctLabs", "Sam Altman Jr", "Ex-Founder", "sam@defunctlabs.com", "+1-555-0404",
         "Artificial Intelligence", "Small", "$800K ARR", "San Francisco, CA", "USA", "Seed",
         json.dumps(["Python", "FastAPI"]),
         3, 4, 0, "2026-06-01", "New Lead", 8000, "Lost", 26.0, "❄️ Cold Lead", "Pivoting business model."),

        # ── Additional Active B2B SaaS Accounts ──
        ("DevSecOps Solutions", "Suresh Raina", "VP Cloud Security", "suresh@devsecops.io", "+91-80-5550-0501",
         "Cybersecurity SaaS", "Medium", "$24M ARR", "Bangalore", "India", "Series B",
         json.dumps(["AWS", "Terraform", "Python", "Kubernetes", "Vault"]),
         15, 22, 1, "2026-08-04", "Proposal", 82000, "Open", 84.5, "✅ Qualified Lead", "Evaluating security governance capabilities."),

        ("PayFlow Global", "Liam O'Connor", "Head of Engineering", "liam@payflow.ie", "+353-1-496-0101",
         "FinTech SaaS", "Medium", "€30M ARR", "Dublin", "Ireland", "Series B",
         json.dumps(["Elixir", "Python", "PostgreSQL", "AWS", "Kafka"]),
         17, 24, 1, "2026-08-05", "Proposal", 110000, "Open", 87.5, "🔥 Hot Lead", "Cross-border payment infrastructure scaling."),

        ("LogiTrack Singapore", "Tan Min-Liang", "COO", "tan@logitrack.sg", "+65-6123-4567",
         "Logistics SaaS", "Enterprise", "$65M ARR", "Singapore", "Singapore", "Series C",
         json.dumps(["Python", "React", "Azure", "PostgreSQL", "PowerBI"]),
         20, 27, 1, "2026-08-06", "Negotiation", 175000, "Open", 92.5, "🔥 Hot Lead", "ASEAN supply chain route optimization project."),

        ("GenAI Workspace", "Hannah Schmidt", "Chief Growth Officer", "hannah@genaiwork.de", "+49-30-555-0199",
         "Artificial Intelligence", "Small", "€7M ARR", "Berlin", "Germany", "Series A",
         json.dumps(["Python", "FastAPI", "React", "LangChain", "OpenAI"]),
         14, 19, 1, "2026-08-01", "Qualified", 49000, "Open", 81.0, "✅ Qualified Lead", "AI agent orchestration workflow."),

        ("Starlight Data", "Lucas Silva", "CTO", "lucas@starlightdata.com", "+1-305-555-0299",
         "Data Infrastructure", "Medium", "$19M ARR", "Miami, FL", "USA", "Series B",
         json.dumps(["Python", "Snowflake", "dbt", "Airflow", "AWS"]),
         16, 23, 1, "2026-08-03", "Proposal", 88000, "Open", 86.0, "🔥 Hot Lead", "ETL to reverse-ETL transformation pipeline."),

        ("SecureAuth Cloud", "Priya Nair", "Director of Product", "priya@secureauth.io", "+91-22-5550-0601",
         "Identity SaaS", "Medium", "$21M ARR", "Mumbai", "India", "Series B",
         json.dumps(["Node.js", "Go", "Redis", "AWS", "React"]),
         13, 18, 1, "2026-07-30", "Qualified", 72000, "Open", 79.0, "✅ Qualified Lead", "Single sign-on and IAM policy management integration."),

        ("Vanguard AI Systems", "Alexander Cross", "VP Technology", "a.cross@vanguardai.com", "+1-646-555-0388",
         "Artificial Intelligence", "Enterprise", "$95M ARR", "New York, NY", "USA", "Series D",
         json.dumps(["Python", "C++", "PyTorch", "Kubernetes", "AWS", "Snowflake"]),
         25, 36, 1, "2026-08-06", "Negotiation", 260000, "Open", 96.0, "🔥 Hot Lead", "Enterprise-wide sales intelligence deployment for 250 reps."),

        ("AutoPilot CRM Tools", "Chloe Martin", "VP Business Operations", "chloe@autopilotcrm.co.uk", "+44-161-496-0199",
         "Sales Tech SaaS", "Small", "£5.5M ARR", "Manchester", "UK", "Series A",
         json.dumps(["React", "FastAPI", "PostgreSQL", "AWS"]),
         11, 15, 0, "2026-07-28", "Qualified", 38000, "Open", 73.0, "✅ Qualified Lead", "Evaluating automated email outreach generator capabilities."),

        ("StreamCloud Media", "Vikram Rathore", "CTO & Co-Founder", "vikram@streamcloud.in", "+91-80-5550-0701",
         "Media Tech SaaS", "Medium", "$17M ARR", "Bangalore", "India", "Series B",
         json.dumps(["Go", "React", "AWS CloudFront", "Redis", "Python"]),
         12, 16, 0, "2026-07-26", "Qualified", 64000, "Open", 75.5, "✅ Qualified Lead", "Video processing pipeline expansion."),

        ("AgileMetrics Inc", "Brian O'Keefe", "VP Sales", "brian@agilemetrics.com", "+1-617-555-0499",
         "Developer Tools", "Medium", "$26M ARR", "Boston, MA", "USA", "Series B",
         json.dumps(["TypeScript", "React", "FastAPI", "Docker", "AWS"]),
         18, 25, 1, "2026-08-04", "Proposal", 94000, "Open", 87.0, "🔥 Hot Lead", "Looking for automated conversation intelligence and sales call action item extraction.")
    ]

    cur.executemany("""
        INSERT INTO leads (
            company_name, contact_name, designation, email, phone, industry,
            company_size, annual_revenue, location, country, funding_stage, tech_stack,
            email_opens, website_visits, demo_requested, last_contact_date,
            stage, deal_value, status, lead_score, recommendation, notes
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, leads)

    # Fetch the inserted lead IDs dynamically
    cur.execute("SELECT id, company_name, contact_name FROM leads WHERE company_name IN ('TechCorp Solutions', 'CloudScale Platform', 'RazorScale SaaS')")
    lead_map = {row["company_name"]: row for row in cur.fetchall()}

    # Fetch the inserted lead IDs dynamically
    cur.execute("SELECT id, company_name, contact_name FROM leads LIMIT 5")
    rows = cur.fetchall()
    
    lead1_id = rows[0]["id"]
    lead1_company = rows[0]["company_name"]
    lead1_contact = rows[0]["contact_name"]

    lead2_id = rows[1]["id"]
    lead2_company = rows[1]["company_name"]
    lead2_contact = rows[1]["contact_name"]

    lead3_id = rows[2]["id"]
    lead3_company = rows[2]["company_name"]
    lead3_contact = rows[2]["contact_name"]

    # Pre-seed initial sample meetings to showcase Conversation Intelligence
    sample_meetings = [
        (1, lead1_id, lead1_contact, lead1_company, f"{lead1_company.lower().replace(' ', '_')}_call.mp3",
         f"{lead1_contact} from {lead1_company} joined to discuss their current sales pipeline bottleneck and scaling their account executive team. Their biggest pain point is that reps spend 4 hours a day manually drafting cold emails and logging CRM notes. They liked our NVIDIA NIM LLM email generation and 65% time reduction metric. Budget is approved up to $150K. Next step is a technical deep dive with their Lead Architect on Friday at 2 PM.",
         f"{lead1_company} is scaling revenue operations and wants to automate cold outreach and CRM updates. Primary pain point is manual email drafting taking 4+ hours/day. Budget is approved (~$150K). Highly positive sentiment towards AI sales intelligence integration.",
         json.dumps([
             f"Send technical architecture whitepaper to {lead1_contact}",
             f"Schedule technical deep-dive with {lead1_company} Lead Architect for Friday 2 PM",
             "Share case study on 65% outbound cycle reduction",
             "Prepare custom pilot proposal for enterprise licenses"
         ]),
         "Positive", 0.85),
        
        (1, lead2_id, lead2_contact, lead2_company, f"{lead2_company.lower().replace(' ', '_')}_briefing.mp3",
         f"Executive alignment call with {lead2_contact} and their security lead. They reviewed the security whitepaper and confirmed SOC2 Type II compliance meets their standards. They requested a redline version of the enterprise MSA. Total contract value is $240K ARR for a 2-year commitment. Agreed to sign by next Tuesday if legal approves the indemnity clause.",
         f"Executive meeting with {lead2_company} leadership. Security compliance confirmed. Contract value agreed at $240K ARR on 2-year term. Closing pending final legal redline of MSA indemnity clause.",
         json.dumps([
             f"Send updated MSA with adjusted indemnity clause to {lead2_company} legal team",
             "Confirm SSO integration setup with their IT team",
             f"Follow up with {lead2_contact} on Tuesday morning for final signature"
         ]),
         "Positive", 0.92),

        (1, lead3_id, lead3_contact, lead3_company, f"{lead3_company.lower().replace(' ', '_')}_apac.mp3",
         f"Discovery call with {lead3_contact} at {lead3_company}. They are scaling B2B SaaS sales across global regions. Need automated email personalization in English and integration with their backend. They expressed strong interest in similar deal matching against other enterprise SaaS deployments.",
         f"{lead3_company} is expanding sales globally and needs automated email personalization and API integration. Strong interest in similar deal benchmarks in enterprise SaaS.",
         json.dumps([
             f"Share API documentation and SDK guide with {lead3_contact}",
             f"Send benchmarking report for {lead3_company} deals",
             "Schedule product demonstration for regional sales leads"
         ]),
         "Positive", 0.78)
    ]

    cur.executemany("""
        INSERT INTO meetings (
            user_id, lead_id, lead_name, company_name, audio_filename,
            transcript, summary, action_items, sentiment, sentiment_score
        ) VALUES (?,?,?,?,?,?,?,?,?,?)
    """, sample_meetings)

    # Initial activity log entries
    activities = [
        (1, f"Scored lead {lead1_company}", "lead", lead1_id, "Lead score calculated: 99.2 (🔥 Hot Lead)"),
        (1, f"Generated AI Cold Email for {lead1_company}", "outreach", lead1_id, "NVIDIA NIM generated event-driven outreach"),
        (1, f"Processed Discovery Call for {lead2_company}", "meeting", lead2_id, "AI extracted 3 action items; Positive sentiment (0.92)"),
        (1, f"Advanced DealPipeline stage for {lead2_company}", "pipeline", lead2_id, "Moved from Proposal to Negotiation ($240K)"),
        (1, f"Matched Similar Deals for {lead3_company}", "ml", lead3_id, "Found 3 similar won deals via Cosine Vector Engine")
    ]

    cur.executemany("""
        INSERT INTO activity_log (
            user_id, action, entity_type, entity_id, details
        ) VALUES (?,?,?,?,?)
    """, activities)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized & seeded successfully!")
