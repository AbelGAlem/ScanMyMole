import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Redis config
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Rate limiting: requests per time window per IP
RATE_TIMES = int(os.getenv("RATE_TIMES", "60"))
RATE_SECONDS = int(os.getenv("RATE_SECONDS", "60"))

TRUSTED_HOSTS = os.getenv("TRUSTED_HOSTS", "*").split(",")