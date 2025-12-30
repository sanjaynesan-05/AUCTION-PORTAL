import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment
load_dotenv()

# Get database URL
db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)

try:
    with engine.begin() as conn:
        print("Dropping auction_state table...")
        conn.execute(text("DROP TABLE IF EXISTS auction_state CASCADE"))
        print("✅ auction_state table dropped")
except Exception as e:
    print(f"❌ Error: {e}")
