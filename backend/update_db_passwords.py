#!/usr/bin/env python3
"""
Direct database update script to reset user passwords.
Run this locally to update the database.
"""
import os
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / '.env')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Get DATABASE_URL from environment (will use the .env file)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in environment")
    sys.exit(1)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create database connection with NullPool for serverless
from sqlalchemy.pool import NullPool
engine = create_engine(DATABASE_URL, poolclass=NullPool, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def update_passwords():
    """Update all user passwords with new defaults"""
    # Import models
    from app.models.orm import User
    
    db = SessionLocal()
    
    password_map = {
        "admin": "admin123",
        "presenter": "presenter123",
        "csk": "team123",
        "mi": "team123",
        "rcb": "team123",
        "kkr": "team123",
        "dc": "team123",
        "rr": "team123",
        "pbks": "team123",
        "srh": "team123",
        "gt": "team123",
        "lsg": "team123"
    }
    
    try:
        print("Fetching all users from database...")
        users = db.query(User).all()
        print(f"Found {len(users)} users")
        
        updated = 0
        for user in users:
            if user.username in password_map:
                old_hash = user.password_hash
                new_hash = pwd_context.hash(password_map[user.username])
                user.password_hash = new_hash
                updated += 1
                print(f"  ✓ Updated {user.username} ({user.role})")
            else:
                print(f"  ✗ Skipped {user.username} (no password in map)")
        
        if updated > 0:
            print(f"\nCommitting {updated} changes...")
            db.commit()
            print("SUCCESS: Database updated!")
        else:
            print("ERROR: No users were updated")
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("="*60)
    print("AUCTION PORTAL - USER PASSWORD RESET")
    print("="*60)
    print(f"Database: {DATABASE_URL[:50]}...")
    print()
    update_passwords()
