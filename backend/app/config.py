import os
from pathlib import Path


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    
    # In Vercel, we might want to use the same domain for AI service
    default_ai_url = "http://localhost:8001"
    if os.getenv("VERCEL_URL"):
        default_ai_url = f"https://{os.getenv('VERCEL_URL')}/api/ai"
    elif os.getenv("VERCEL"):
        # Local vercel dev usually runs on port 3000
        default_ai_url = "http://localhost:3000/api/ai"
        
    AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", default_ai_url)
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///civiceye.db")
    DATABASE_PATH = DATABASE_URL.replace("sqlite:///", "")
    
    # In Vercel or other serverless envs, we can only write to /tmp
    if os.getenv("VERCEL") or os.getenv("VERCEL_ENV"):
        DATABASE_PATH = "/tmp/civiceye.db"
    elif not os.path.isabs(DATABASE_PATH):
        DATABASE_PATH = str(Path(__file__).resolve().parents[1] / DATABASE_PATH)

