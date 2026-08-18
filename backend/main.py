import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import init_db
from routers import auth, crm, ml, outreach, meetings, dashboard, automation
from scheduler import start_scheduler

load_dotenv()

app = FastAPI(
    title="SaaS-SalesGenie AI — SaaS Lead Intelligence & Sales CRM",
    description="Full-stack AI-driven Sales Intelligence Platform powered by NVIDIA NIM & Scikit-Learn",
    version="1.0.0"
)


# Robust CORS policy for Localhost, Vercel preview & production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://salesgenie.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth.router)
app.include_router(crm.router)
app.include_router(ml.router)
app.include_router(outreach.router)
app.include_router(meetings.router)
app.include_router(dashboard.router)
app.include_router(automation.router)

# Direct alias for frontend outreach convenience
@app.post("/api/ai/generate-outreach")
async def generate_outreach_alias_route(payload: dict):
    from routers.outreach import generate_outreach_alias
    return await generate_outreach_alias(payload)


@app.on_event("startup")
def on_startup():
    init_db()
    start_scheduler()
    print("🚀 SalesGenie AI Backend initialized with SQLite and ML engine!")


@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "SalesGenie AI Engine",
        "version": "1.0.0",
        "ml_engine": "RandomForestClassifier + TF-IDF Cosine Similarity",
        "llm_engine": "NVIDIA NIM (meta/llama-3.1-70b-instruct)",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
