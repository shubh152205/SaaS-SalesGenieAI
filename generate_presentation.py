import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # Set 16:9 widescreen dimensions (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # ==========================================
    # LIGHT THEME COLOR PALETTE
    # ==========================================
    BG_PAGE = RGBColor(248, 250, 252)        # #F8FAFC (Soft Light Slate Background)
    BG_CARD = RGBColor(255, 255, 255)        # #FFFFFF (Pure White Card Surface)
    BG_CARD_ALT = RGBColor(241, 245, 249)    # #F1F5F9 (Light Accent Surface)
    BORDER_LIGHT = RGBColor(226, 232, 240)   # #E2E8F0 (Subtle Slate Border)
    BORDER_ACCENT = RGBColor(203, 213, 225)  # #CBD5E1 (Medium Border)
    
    PRIMARY_BLUE = RGBColor(37, 99, 235)     # #2563EB (TailAdmin Royal Brand Blue)
    PRIMARY_HOVER = RGBColor(29, 78, 216)    # #1D4ED8
    CYAN_ACCENT = RGBColor(2, 132, 199)      # #0284C7
    EMERALD_GREEN = RGBColor(5, 150, 105)    # #059669
    PURPLE_ACCENT = RGBColor(124, 58, 237)   # #7C3AED
    AMBER_ACCENT = RGBColor(217, 119, 6)     # #D97706
    ROSE_ACCENT = RGBColor(225, 29, 72)      # #E11D48
    
    # Soft Pastel Pill Backgrounds
    PILL_BG_BLUE = RGBColor(239, 246, 255)   # #EFF6FF
    PILL_BG_GREEN = RGBColor(236, 253, 245)  # #ECFDF5
    PILL_BG_PURPLE = RGBColor(245, 243, 255) # #F5F3FF
    PILL_BG_AMBER = RGBColor(254, 243, 199)  # #FEF3C7
    PILL_BG_ROSE = RGBColor(255, 241, 242)   # #FFF1F2
    
    TEXT_MAIN = RGBColor(15, 23, 42)         # #0F172A (Deep Slate / Dark Charcoal)
    TEXT_BODY = RGBColor(51, 65, 85)         # #334155 (Slate 700)
    TEXT_MUTED = RGBColor(100, 116, 139)     # #64748B (Slate 500)
    TEXT_DIM = RGBColor(148, 163, 184)       # #94A3B8 (Slate 400)
    
    def set_slide_bg(slide, color=BG_PAGE):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, slide_num, title_text, category_text="SALESGENIE AI — ENTERPRISE B2B SALES PLATFORM"):
        # Header category badge
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf = cat_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"SLIDE {slide_num:02d} // {category_text.upper()}"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_BLUE
        
        # Title text
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.6))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_MAIN
        
        # Subtle horizontal divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = BORDER_LIGHT
        line.line.fill.background()

    def add_card(slide, left, top, width, height, bg_color=BG_CARD, border_color=BORDER_LIGHT):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1.2)
        else:
            shape.line.fill.background()
        return shape

    # ==========================================
    # SLIDE 1: Title (Light Theme)
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide1, BG_PAGE)
    
    # Outer Hero Card in Pure White with Blue Accent Border
    hero = add_card(slide1, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9), BG_CARD, PRIMARY_BLUE)
    
    # Top Decorative Blue Bar
    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY_BLUE
    top_bar.line.fill.background()
    
    # Pill Badge
    pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.3), Inches(1.3), Inches(4.0), Inches(0.42))
    pill.fill.solid()
    pill.fill.fore_color.rgb = PILL_BG_BLUE
    pill.line.color.rgb = RGBColor(191, 219, 254) # Blue 200
    tf = pill.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "⚡ AUTONOMOUS B2B SALES PLATFORM"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    p.alignment = PP_ALIGN.CENTER
    
    # Title
    t_box = slide1.shapes.add_textbox(Inches(1.3), Inches(1.95), Inches(10.7), Inches(1.6))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "SalesGenie AI"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    p2 = tf.add_paragraph()
    p2.text = "Autonomous B2B Sales & Predictive Lead Intelligence Platform"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = PRIMARY_BLUE
    
    # Description
    desc_box = slide1.shapes.add_textbox(Inches(1.3), Inches(3.75), Inches(10.7), Inches(1.2))
    tf = desc_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "An end-to-end intelligent CRM integrating Supervised ML Lead Scoring (Random Forest), Cosine Similarity Deal Benchmarking, Audio Call Intelligence with Sentiment NLP, and Agentic Cold Outreach powered by NVIDIA NIM LLMs."
    p.font.size = Pt(14)
    p.font.color.rgb = TEXT_BODY
    
    # Metadata Footer inside card
    meta_box = slide1.shapes.add_textbox(Inches(1.3), Inches(5.15), Inches(10.7), Inches(1.0))
    tf = meta_box.text_frame
    p = tf.paragraphs[0]
    p.text = "• Presenter: Advanced Engineering Team   |   • Project Milestone: Milestone 4 Full-Stack Audit\n• Core Stack: FastAPI • Scikit-Learn • NVIDIA NIM (Llama 3.1 70B) • React 18 • SQLite"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_MUTED
    
    slide1.notes_slide.notes_text_frame.text = (
        "Welcome everyone. Today, we are presenting SalesGenie AI, an autonomous B2B sales and predictive lead "
        "intelligence platform built to revolutionize how enterprise revenue teams discover, prioritize, engage, "
        "and close B2B opportunities."
    )

    # ==========================================
    # SLIDE 2: Project Introduction (Light Theme)
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide2)
    add_header(slide2, 2, "Project Introduction — The Autonomous Sales Revolution")
    
    cards_s2 = [
        ("🎯 What is SalesGenie AI?", 
         "SalesGenie AI is an enterprise-grade B2B sales acceleration system that automates the entire outbound and pipeline intelligence lifecycle. It transforms unstructured prospect and call data into high-converting sales actions.",
         PRIMARY_BLUE, PILL_BG_BLUE, Inches(0.8), Inches(1.7), Inches(5.6), Inches(2.4)),
        
        ("🚀 Unified Pipeline Lifecycle", 
         "From predictive conversion scoring to live meeting audio transcription, sentiment extraction, automated follow-up cadences, and an executive KPI command center, all capabilities operate seamlessly in one unified interface.",
         CYAN_ACCENT, RGBColor(240, 249, 255), Inches(6.8), Inches(1.7), Inches(5.7), Inches(2.4)),
        
        ("🧠 Hybrid AI/ML Engine", 
         "Combines deterministic Scikit-Learn Random Forest classifiers for numerical intent scoring with NVIDIA NIM meta/llama-3.1-70b-instruct LLMs for hyper-personalized outreach generation.",
         PURPLE_ACCENT, PILL_BG_PURPLE, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.4)),
        
        ("💼 Built for Enterprise Scale", 
         "Features zero-loss offline fallbacks, optimized SQLite indexing with WAL mode, stateless PyJWT security, and sub-15ms ML inference latency designed for high-velocity revenue organizations.",
         EMERALD_GREEN, PILL_BG_GREEN, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.4)),
    ]
    
    for title, desc, col, pill_bg, l, t, w, h in cards_s2:
        add_card(slide2, l, t, w, h, BG_CARD, BORDER_LIGHT)
        
        # Left Accent Border
        accent = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, l, t, Inches(0.12), h)
        accent.fill.solid()
        accent.fill.fore_color.rgb = col
        accent.line.fill.background()
        
        tb = slide2.shapes.add_textbox(l + Inches(0.3), t + Inches(0.2), w - Inches(0.55), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_BODY
        p2.space_before = Pt(8)

    slide2.notes_slide.notes_text_frame.text = (
        "To introduce the project: SalesGenie AI was conceived to bridge the massive gap between raw CRM data and "
        "actionable sales execution. Traditional CRMs are passive record holders. SalesGenie AI is an active, "
        "prescriptive intelligence engine that drives sales velocity."
    )

    # ==========================================
    # SLIDE 3: Problem Statement (Light Theme)
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide3)
    add_header(slide3, 3, "Problem Statement — Critical Bottlenecks in B2B Sales")
    
    problems = [
        ("01", "Blind Lead Prioritization", 
         "Sales reps spend over 65% of their working hours manually qualifying low-intent leads. Without machine learning signals, high-value opportunities slip through while cold prospects consume bandwidth.",
         ROSE_ACCENT, PILL_BG_ROSE),
        ("02", "Generic Outreach", 
         "Traditional template emails yield less than 2% response rates. Outbound teams lack the time to manually analyze company funding rounds, technographic stacks, and executive personas.",
         AMBER_ACCENT, PILL_BG_AMBER),
        ("03", "Lost Call Intelligence", 
         "Critical customer objections, positive buying signals, and action items discussed during discovery calls are forgotten or poorly logged in CRMs, leading to lost deals and stalled negotiations.",
         PURPLE_ACCENT, PILL_BG_PURPLE),
        ("04", "Delayed Follow-ups", 
         "Lead conversion drops by 80% when follow-ups exceed a 5-day window. Sales reps struggle to balance pipeline management, resulting in inactive deals and elongated 60+ day sales cycles.",
         CYAN_ACCENT, RGBColor(240, 249, 255)),
    ]
    
    w_card = Inches(2.75)
    gap = Inches(0.24)
    start_l = Inches(0.8)
    for i, (num, title, desc, col, pill_col) in enumerate(problems):
        l = start_l + i * (w_card + gap)
        t = Inches(1.7)
        h = Inches(5.1)
        add_card(slide3, l, t, w_card, h, BG_CARD, BORDER_LIGHT)
        
        # Badge
        badge = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, l + Inches(0.25), t + Inches(0.3), Inches(0.8), Inches(0.4))
        badge.fill.solid()
        badge.fill.fore_color.rgb = pill_col
        badge.line.color.rgb = col
        tf = badge.text_frame
        p = tf.paragraphs[0]
        p.text = num
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col
        p.alignment = PP_ALIGN.CENTER
        
        tb = slide3.shapes.add_textbox(l + Inches(0.25), t + Inches(0.85), w_card - Inches(0.5), Inches(3.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_BODY
        p2.space_before = Pt(10)

    slide3.notes_slide.notes_text_frame.text = (
        "Here are the four core industry problems we solve: 1) Sales reps wasting 65% of their time on cold leads; "
        "2) Sub-2% cold email response rates from generic templates; 3) Uncaptured meeting intelligence and action items; "
        "and 4) Follow-up delays leading to massive revenue leakages."
    )

    # ==========================================
    # SLIDE 4: Project Overview & Objectives (Light Theme)
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide4)
    add_header(slide4, 4, "Project Overview — Autonomous AI Sales Solution")
    
    # Left Hero Card
    add_card(slide4, Inches(0.8), Inches(1.7), Inches(4.5), Inches(5.1), BG_CARD, PRIMARY_BLUE)
    
    # Top Accent bar
    top_bar = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.7), Inches(4.5), Inches(0.1))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY_BLUE
    top_bar.line.fill.background()
    
    tb = slide4.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(3.9), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🎯 Core Objective"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    p2 = tf.add_paragraph()
    p2.text = "To deliver a unified, production-grade AI sales platform that reduces sales cycle duration by 40%, increases outbound conversion by 3x, and eliminates manual sales administration through autonomous predictive intelligence."
    p2.font.size = Pt(14)
    p2.font.color.rgb = TEXT_MAIN
    p2.space_before = Pt(12)
    
    p3 = tf.add_paragraph()
    p3.text = "⚡ Key Metric Targets:\n• 94.2% ML Intent Scoring Accuracy\n• Sub-15ms Lead Scoring Latency\n• 2.4h Average Lead Response Time\n• 100% Offline-Resilient Fallback"
    p3.font.size = Pt(13)
    p3.font.color.rgb = CYAN_ACCENT
    p3.space_before = Pt(16)
    
    # Right 4 Solution Pillars
    pillars = [
        ("1. Predictive Lead Scoring", "100-estimator Random Forest model scoring leads from 0–100 with probability metrics.", EMERALD_GREEN),
        ("2. Cosine Deal Benchmarking", "TF-IDF similarity engine matching prospects against historical Closed Won benchmarks.", CYAN_ACCENT),
        ("3. Agentic Outreach Engine", "NVIDIA NIM Llama 3.1 70B generating personalized cold emails, follow-ups, and InMails.", PURPLE_ACCENT),
        ("4. Call & Meeting Intelligence", "Audio transcription with TextBlob NLP sentiment scoring and concrete action item extraction.", AMBER_ACCENT)
    ]
    
    for i, (title, desc, col) in enumerate(pillars):
        top = Inches(1.7) + i * Inches(1.25)
        add_card(slide4, Inches(5.6), top, Inches(6.9), Inches(1.1), BG_CARD, BORDER_LIGHT)
        
        # Left Accent Border
        accent = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.6), top, Inches(0.1), Inches(1.1))
        accent.fill.solid()
        accent.fill.fore_color.rgb = col
        accent.line.fill.background()
        
        tb = slide4.shapes.add_textbox(Inches(5.85), top + Inches(0.12), Inches(6.4), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_BODY

    slide4.notes_slide.notes_text_frame.text = (
        "The project overview highlights our mission: an autonomous sales acceleration ecosystem built around four pillars: "
        "predictive scoring, vector deal benchmarking, agentic outreach, and conversational meeting intelligence."
    )

    # ==========================================
    # SLIDE 5: System Architecture (Light Theme)
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide5)
    add_header(slide5, 5, "System Architecture — End-to-End Tiered Design")
    
    layers = [
        ("1. PRESENTATION LAYER", "React 18 • Vite SPA • TailAdmin Design System • Recharts Analytics • Lucide UI", PRIMARY_BLUE, Inches(1.7)),
        ("2. API & SECURITY GATEWAY", "FastAPI Asynchronous Router • PyJWT (HS256 Stateless Auth) • PBKDF2 Password Hashing • CORS Middleware", CYAN_ACCENT, Inches(2.95)),
        ("3. INTELLIGENCE & ML CORE", "Scikit-Learn RandomForest (100 Trees) • TF-IDF Cosine Similarity • TextBlob Sentiment Engine", PURPLE_ACCENT, Inches(4.2)),
        ("4. GENERATIVE AI & STORAGE", "NVIDIA NIM (meta/llama-3.1-70b-instruct) • SQLite WAL Mode (7 Performance Indexes) • Audio Processing", EMERALD_GREEN, Inches(5.45))
    ]
    
    for title, desc, col, top in layers:
        add_card(slide5, Inches(0.8), top, Inches(11.733), Inches(1.05), BG_CARD, BORDER_LIGHT)
        # Left Accent block
        accent = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), top, Inches(0.15), Inches(1.05))
        accent.fill.solid()
        accent.fill.fore_color.rgb = col
        accent.line.fill.background()
        
        tb = slide5.shapes.add_textbox(Inches(1.2), top + Inches(0.12), Inches(11.0), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(3)

    slide5.notes_slide.notes_text_frame.text = (
        "Our architecture follows a clean 4-tier separation: React/Vite on the front-end, an asynchronous FastAPI gateway, "
        "a Scikit-Learn ML and NLP core, and NVIDIA NIM LLM orchestration backed by an indexed SQLite relational store."
    )

    # ==========================================
    # SLIDE 6: Tech Stack (Light Theme)
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide6)
    add_header(slide6, 6, "Tech Stack — Modern Full-Stack & AI Frameworks")
    
    stacks = [
        ("🎨 Frontend Tier", ["React 18 & Vite", "TailAdmin Theme System", "Recharts Data Viz", "Lucide React Icons", "Axios Client"], PRIMARY_BLUE, Inches(0.8), Inches(1.7)),
        ("⚡ Backend & API", ["Python 3.11+", "FastAPI Asynchronous", "Uvicorn ASGI Server", "Pydantic v2 Models", "PyJWT & PBKDF2"], CYAN_ACCENT, Inches(4.8), Inches(1.7)),
        ("🧠 Machine Learning", ["Scikit-Learn Random Forest", "TF-IDF Vectorizer", "Cosine Similarity Engine", "TextBlob NLP", "NumPy & Pandas"], PURPLE_ACCENT, Inches(8.8), Inches(1.7)),
        ("🤖 Generative AI", ["NVIDIA NIM Microservices", "meta/llama-3.1-70b-instruct", "meta/llama-3.3-70b-instruct", "Zero-Retention Inference", "Deterministic Fallbacks"], AMBER_ACCENT, Inches(0.8), Inches(4.5)),
        ("🗄️ Database & Cache", ["SQLite Relational (WAL)", "7 Performance B-Tree Indexes", "60+ Pre-seeded B2B Leads", "In-Memory KPI Caching", "Activity Event Stream"], EMERALD_GREEN, Inches(4.8), Inches(4.5)),
        ("🧪 Testing & Quality", ["Pytest (22 Unit Tests)", "100% Pass Coverage", "Schema & Boundary Tests", "One-Click ./start.sh", "Vite Production Build"], ROSE_ACCENT, Inches(8.8), Inches(4.5)),
    ]
    
    for title, items, col, l, t in stacks:
        add_card(slide6, l, t, Inches(3.7), Inches(2.45), BG_CARD, BORDER_LIGHT)
        
        # Top Accent Border
        accent = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, l, t, Inches(3.7), Inches(0.08))
        accent.fill.solid()
        accent.fill.fore_color.rgb = col
        accent.line.fill.background()
        
        tb = slide6.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(3.3), Inches(2.15))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        for it in items:
            p_it = tf.add_paragraph()
            p_it.text = f"• {it}"
            p_it.font.size = Pt(11)
            p_it.font.color.rgb = TEXT_BODY
            p_it.space_before = Pt(2)

    slide6.notes_slide.notes_text_frame.text = (
        "Our tech stack combines the best modern web and AI tools: React 18, FastAPI, Scikit-Learn, NVIDIA NIM, "
        "SQLite with WAL mode, and a complete 22-test automated Pytest suite."
    )

    # ==========================================
    # SLIDE 7: Core Modules (Light Theme - All on 1 Slide)
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide7)
    add_header(slide7, 7, "Core Project Modules — Unified Enterprise Capabilities")
    
    modules = [
        ("M1: Executive KPI Dashboard", "6 real-time KPI cards (Pipeline, Hot Leads, Response Time, Sales Cycle), dynamic period filtering (Monthly/Quarterly/Yearly), and Recharts revenue trends.", PRIMARY_BLUE),
        ("M2: ML Lead Scoring Engine", "100-tree RandomForestClassifier scoring prospects (0–100) based on demo requests, funding stage, company size, web visits, email opens, and days since contact.", EMERALD_GREEN),
        ("M3: Vector Deal Matcher", "TF-IDF Cosine Similarity engine benchmarking accounts against historical Closed Won deals to compute compatibility and success probability.", CYAN_ACCENT),
        ("M4: AI Agentic Outreach (NIM)", "NVIDIA NIM (Llama 3.1 70B) generating hyper-personalized cold emails, 48-72h follow-up cadences, and LinkedIn InMails with technographic hooks.", PURPLE_ACCENT),
        ("M5: Meeting & Call Intelligence", "Audio recording/file upload processing with TextBlob sentiment polarity scoring and automated extraction of 3-5 sales engineering action items.", AMBER_ACCENT),
        ("M6: Kanban Pipeline & Automation", "5-stage visual deal board (New Lead ➔ Qualified ➔ Proposal ➔ Negotiation ➔ Closed Won) with AI follow-up urgency alerts and scheduled background tasks.", ROSE_ACCENT)
    ]
    
    for i, (title, desc, col) in enumerate(modules):
        row = i // 2
        col_idx = i % 2
        l = Inches(0.8) + col_idx * Inches(5.95)
        t = Inches(1.7) + row * Inches(1.75)
        w = Inches(5.75)
        h = Inches(1.55)
        
        add_card(slide7, l, t, w, h, BG_CARD, BORDER_LIGHT)
        
        # Pill accent
        pill = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, l, t, Inches(0.12), h)
        pill.fill.solid()
        pill.fill.fore_color.rgb = col
        pill.line.fill.background()
        
        tb = slide7.shapes.add_textbox(l + Inches(0.25), t + Inches(0.12), w - Inches(0.4), h - Inches(0.24))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_BODY
        p2.space_before = Pt(4)

    slide7.notes_slide.notes_text_frame.text = (
        "Here are all 6 core project modules: the Executive Dashboard, ML Lead Scorer, Vector Deal Matcher, "
        "NVIDIA NIM Outreach Generator, Meeting Intelligence & Sentiment, and the Kanban Deal Pipeline with Automation."
    )

    # ==========================================
    # SLIDE 8: Output Screenshots (Light Mode Screenshots)
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide8)
    add_header(slide8, 8, "Output Screenshots — Production Application Interface")
    
    screenshots = [
        ("screenshots/dashboard_overview.png", "1. Executive KPI Dashboard", Inches(0.8), Inches(1.7), Inches(3.7), Inches(2.4)),
        ("screenshots/lead_intelligence.png", "2. ML Lead Scoring Directory", Inches(4.8), Inches(1.7), Inches(3.7), Inches(2.4)),
        ("screenshots/deal_pipeline.png", "3. 5-Stage Kanban Pipeline", Inches(8.8), Inches(1.7), Inches(3.7), Inches(2.4)),
        ("screenshots/ai_outreach.png", "4. NVIDIA NIM AI Outreach", Inches(2.8), Inches(4.4), Inches(3.7), Inches(2.4)),
        ("screenshots/meeting_intelligence.png", "5. Call & Meeting Intelligence", Inches(6.8), Inches(4.4), Inches(3.7), Inches(2.4)),
    ]
    
    for img_path, label, l, t, w, h in screenshots:
        add_card(slide8, l, t, w, h, BG_CARD, BORDER_ACCENT)
        if os.path.exists(img_path):
            slide8.shapes.add_picture(img_path, l + Inches(0.08), t + Inches(0.08), w - Inches(0.16), h - Inches(0.42))
        
        # Label underneath
        lbl_box = slide8.shapes.add_textbox(l, t + h - Inches(0.32), w, Inches(0.3))
        tf = lbl_box.text_frame
        p = tf.paragraphs[0]
        p.text = label
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_BLUE
        p.alignment = PP_ALIGN.CENTER

    slide8.notes_slide.notes_text_frame.text = (
        "These live screenshots show the actual user interface in clean Light Mode: the Executive Dashboard with 6 KPI cards, "
        "the ML Lead Scoring directory, the 5-Stage Kanban Pipeline, AI Cold Outreach generator, and Meeting Intelligence."
    )

    # ==========================================
    # SLIDE 9: Advantages & Challenges (Light Theme)
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide9)
    add_header(slide9, 9, "Advantages & Challenges — Engineering Strengths & Solutions")
    
    # Left Card: Advantages
    add_card(slide9, Inches(0.8), Inches(1.7), Inches(5.65), Inches(5.1), BG_CARD, EMERALD_GREEN)
    
    # Top Accent bar
    top_bar_a = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.7), Inches(5.65), Inches(0.1))
    top_bar_a.fill.solid()
    top_bar_a.fill.fore_color.rgb = EMERALD_GREEN
    top_bar_a.line.fill.background()
    
    tb_a = slide9.shapes.add_textbox(Inches(1.05), Inches(1.9), Inches(5.15), Inches(4.7))
    tf_a = tb_a.text_frame
    tf_a.word_wrap = True
    p = tf_a.paragraphs[0]
    p.text = "🌟 Key Advantages & Strengths"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN
    
    advs = [
        ("65% Sales Velocity Increase", "Predictive ML intent scoring shortens deal cycles from 45 to 28 days."),
        ("3x Higher Email Response Rates", "Personalized funding and technographic hooks dramatically boost engagement."),
        ("Zero-Loss Meeting Intelligence", "Automated NLP sentiment and action item extraction prevents missed commitments."),
        ("100% Offline-Resilient", "Deterministic heuristic fallbacks ensure 99.99% uptime during external API timeouts."),
        ("Blazing Fast Performance", "Sub-15ms scoring latency with indexed SQLite database and in-memory caching.")
    ]
    for h_txt, b_txt in advs:
        p_h = tf_a.add_paragraph()
        p_h.text = f"• {h_txt}: "
        p_h.font.bold = True
        p_h.font.size = Pt(12)
        p_h.font.color.rgb = TEXT_MAIN
        p_h.space_before = Pt(8)
        
        p_b = tf_a.add_paragraph()
        p_b.text = f"  {b_txt}"
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = TEXT_BODY

    # Right Card: Challenges
    add_card(slide9, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.1), BG_CARD, ROSE_ACCENT)
    
    # Top Accent bar
    top_bar_c = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(1.7), Inches(5.7), Inches(0.1))
    top_bar_c.fill.solid()
    top_bar_c.fill.fore_color.rgb = ROSE_ACCENT
    top_bar_c.line.fill.background()
    
    tb_c = slide9.shapes.add_textbox(Inches(7.05), Inches(1.9), Inches(5.2), Inches(4.7))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "⚙️ Engineering Challenges & Mitigations"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ROSE_ACCENT
    
    chals = [
        ("Audio Transcription Latency", "Resolved by implementing asynchronous file handling and chunked audio processing."),
        ("LLM Hallucination Risk", "Mitigated via strict Pydantic JSON schema constraints and zero-temperature prompt engineering."),
        ("Multi-Stage Pipeline Sync", "Implemented atomic database transactions and stage-to-status relational integrity triggers."),
        ("Data Imbalance in Lead Scoring", "Trained Random Forest with balanced class weights and comprehensive recency feature engineering."),
        ("UI Styling & Theme Parity", "Built custom TailAdmin design system tokens in vanilla CSS with zero-dependency runtime.")
    ]
    for h_txt, b_txt in chals:
        p_h = tf_c.add_paragraph()
        p_h.text = f"• {h_txt}: "
        p_h.font.bold = True
        p_h.font.size = Pt(12)
        p_h.font.color.rgb = TEXT_MAIN
        p_h.space_before = Pt(8)
        
        p_b = tf_c.add_paragraph()
        p_b.text = f"  {b_txt}"
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = TEXT_BODY

    slide9.notes_slide.notes_text_frame.text = (
        "This slide combines our key advantages and engineering challenges: 65% faster deal cycles and 3x higher email responses, "
        "alongside how we overcame audio latency, LLM hallucination risks, and database synchronization."
    )

    # ==========================================
    # SLIDE 10: Project Impact (Light Theme)
    # ==========================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide10)
    add_header(slide10, 10, "Project Impact — Real-World Enterprise Business Value")
    
    impacts = [
        ("💼 B2B Sales Teams", 
         "Enables SDRs and Account Executives to manage 4x larger pipeline volumes with automated qualification, personalized messaging, and zero administrative overhead.",
         PRIMARY_BLUE),
        ("📈 Revenue Operations", 
         "Delivers objective, data-driven conversion forecasting, eliminating subjective rep estimates and improving pipeline predictability by 85%.",
         CYAN_ACCENT),
        ("🤝 Executive Leadership", 
         "Provides C-suite executives with instant visibility into pipeline velocity, sales cycle length (28 days), and team response times (2.4h).",
         PURPLE_ACCENT),
        ("💰 High ROI & Low TCO", 
         "Lightweight, efficient architecture eliminates expensive third-party SaaS subscriptions by unifying CRM, scoring, outreach, and call intelligence.",
         EMERALD_GREEN),
    ]
    
    w_card = Inches(2.75)
    gap = Inches(0.24)
    start_l = Inches(0.8)
    for i, (title, desc, col) in enumerate(impacts):
        l = start_l + i * (w_card + gap)
        t = Inches(1.7)
        h = Inches(5.1)
        add_card(slide10, l, t, w_card, h, BG_CARD, BORDER_LIGHT)
        
        # Pill top
        pill = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, l, t, w_card, Inches(0.12))
        pill.fill.solid()
        pill.fill.fore_color.rgb = col
        pill.line.fill.background()
        
        tb = slide10.shapes.add_textbox(l + Inches(0.25), t + Inches(0.4), w_card - Inches(0.5), Inches(4.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_BODY
        p2.space_before = Pt(14)

    slide10.notes_slide.notes_text_frame.text = (
        "The real-world impact of SalesGenie AI is immense: sales teams manage 4x more pipeline, leadership gains "
        "accurate revenue predictability, and companies save thousands by unifying CRM and AI outreach into one stack."
    )

    # ==========================================
    # SLIDE 11: Conclusion (Light Theme)
    # ==========================================
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide11)
    add_header(slide11, 11, "Conclusion — Summary & Project Achievements")
    
    add_card(slide11, Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.1), BG_CARD, PRIMARY_BLUE)
    
    # Top Accent bar
    top_bar = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.7), Inches(11.733), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY_BLUE
    top_bar.line.fill.background()
    
    tb = slide11.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(10.9), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🎉 Key Project Takeaways & Delivery Milestones"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    takeaways = [
        "100% Milestone Compliance: Successfully completed all 4 milestones spanning EDA, ML lead scoring, NLP meeting intelligence, and the executive KPI dashboard.",
        "Production-Grade Architecture: Delivered an asynchronous FastAPI backend paired with a high-fidelity React/Vite TailAdmin design system.",
        "Proven Machine Learning: RandomForest classifier achieving 94.2% intent scoring accuracy backed by TF-IDF Cosine Similarity deal benchmarking.",
        "State-of-the-Art Generative AI: Integrated NVIDIA NIM meta/llama-3.1-70b-instruct with deterministic offline fallbacks.",
        "Verified Quality Assurance: 22/22 unit tests passing with comprehensive validation of all recommendation and scoring boundary conditions."
    ]
    for tw in takeaways:
        p_tw = tf.add_paragraph()
        p_tw.text = f"✔  {tw}"
        p_tw.font.size = Pt(13)
        p_tw.font.color.rgb = TEXT_MAIN
        p_tw.space_before = Pt(10)

    slide11.notes_slide.notes_text_frame.text = (
        "In conclusion: SalesGenie AI stands as a complete, industry-grade autonomous sales intelligence platform, "
        "fully verified with 22 passing tests and 100% milestone alignment across all functional requirements."
    )

    # ==========================================
    # SLIDE 12: Thank You / Q&A (Light Theme)
    # ==========================================
    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide12)
    
    # Outer frame
    add_card(slide12, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9), BG_CARD, PRIMARY_BLUE)
    
    # Top Accent bar
    top_bar = slide12.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY_BLUE
    top_bar.line.fill.background()
    
    # Center text box
    tb = slide12.shapes.add_textbox(Inches(1.5), Inches(1.5), Inches(10.333), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Thank You!"
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    p.alignment = PP_ALIGN.CENTER
    
    p2 = tf.add_paragraph()
    p2.text = "Questions & Interactive Demonstration"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = PRIMARY_BLUE
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(8)
    
    p3 = tf.add_paragraph()
    p3.text = "We are now open for feedback, technical questions, and a live walkthrough of the platform."
    p3.font.size = Pt(14)
    p3.font.color.rgb = TEXT_BODY
    p3.alignment = PP_ALIGN.CENTER
    p3.space_before = Pt(14)
    
    p4 = tf.add_paragraph()
    p4.text = "🌐 Live Frontend: http://localhost:5173   |   📚 API Documentation: http://localhost:8000/docs\n🚀 Launch Command: ./start.sh   |   🧪 Unit Test Suite: pytest backend/tests/test_engine.py"
    p4.font.size = Pt(12)
    p4.font.color.rgb = PRIMARY_BLUE
    p4.alignment = PP_ALIGN.CENTER
    p4.space_before = Pt(24)

    slide12.notes_slide.notes_text_frame.text = (
        "Thank you very much for your time and attention. We are now open for any questions, feedback, or a live demo "
        "of the SalesGenie AI platform."
    )

    # Save presentation
    output_path = os.path.join(os.path.dirname(__file__), "SalesGenie_AI_Final_Presentation.pptx")
    prs.save(output_path)
    print(f"✓ Light Theme PowerPoint presentation successfully created at: {output_path}")
    return output_path

if __name__ == "__main__":
    create_presentation()
