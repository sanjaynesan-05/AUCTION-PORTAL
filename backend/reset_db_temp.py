import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from app.models.orm import Base

# Load environment variables
load_dotenv()

# Get database URL
db_url = os.getenv("DATABASE_URL", "")
print(f"Database URL: {db_url[:50]}...")

try:
    # Create engine
    engine = create_engine(db_url, echo=False)
    
    # Connect and drop tables
    with engine.begin() as conn:
        print("\nDropping existing tables...")
        conn.execute(text("DROP TABLE IF EXISTS players CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS auction_states CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS teams CASCADE"))
        print("✅ Tables dropped")
        
    # Recreate tables from ORM
    print("Creating new tables from ORM schema...")
    Base.metadata.create_all(engine)
    print("✅ New tables created")
    
    # Verify tables
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\n✅ Tables in database: {tables}")
    
    # Check teams columns
    if 'teams' in tables:
        columns = inspector.get_columns('teams')
        print(f"\nTeams table columns:")
        for col in columns:
            print(f"  - {col['name']}: {col['type']}")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
