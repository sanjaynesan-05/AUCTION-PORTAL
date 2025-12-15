"""
Drop all tables and recreate with new schema
Run this to migrate the database to the new admin-controlled schema
"""
from app.database import engine, SessionLocal
from app.models.orm import Base
from app.models.seed import safe_seed_database
from sqlalchemy import text

def reset_database():
    print("🗑️  Dropping all existing tables...")
    
    # Drop all tables with CASCADE to handle dependencies
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        conn.commit()
    
    print("✓ Schema reset")
    
    print("🔨 Creating tables with new schema...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")
    
    print("📋 Seeding database...")
    db = SessionLocal()
    try:
        safe_seed_database(db)
        print("✓ Database seeded successfully")
    finally:
        db.close()
    
    print("✅ Database reset complete!")

if __name__ == "__main__":
    reset_database()
