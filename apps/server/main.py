import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services import load_model, get_client_ip
from app.api.routes import router

from redis import asyncio as redis
from fastapi_limiter import FastAPILimiter
from app.config import REDIS_URL, TRUSTED_HOSTS


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Loading model...")
    load_model()
    print("Model loaded successfully!")
    redis_client = redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis_client, identifier=get_client_ip)
    yield
    # Shutdown (if needed)


app = FastAPI(title="Skin Cancer ViT+Tabular API", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=TRUSTED_HOSTS if "*" not in TRUSTED_HOSTS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
