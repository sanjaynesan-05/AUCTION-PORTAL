import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://neondb_owner:npg_EyX0teJ9ZjMo@ep-holy-snow-a13hmayg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
)

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# API Configuration
API_TITLE = "IPL Auction Portal API"
API_DESCRIPTION = "Backend API for IPL Auction Portal with PostgreSQL"
API_VERSION = "2.0.0"
