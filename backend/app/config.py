import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
# IMPORTANT: DATABASE_URL must be set via environment variables in production
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://localhost/auctiondb"  # Safe default for development
)

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "auction-portal-dev-secret-key-2024-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# API Configuration
API_TITLE = "IPL Auction Portal API"
API_DESCRIPTION = "Backend API for IPL Auction Portal with PostgreSQL"
API_VERSION = "2.0.0"
