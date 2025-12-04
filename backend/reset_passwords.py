"""
Reset user passwords in the database to use new default credentials.
This script connects to the Render database and updates all user password hashes.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Database configuration
DATABASE_URL = "postgresql://newuser:q7rTGBECF2nSoqZFbHq5gJ8sJpJMqVqE@dpg-cvq4p5v2ng1l73avuh9g-a.oregon-postgres.render.com/auctiondb"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# New default passwords
passwords = {
    "admin": "admin123",
    "presenter": "presenter123",
    # Team users all use team123
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

def update_user_passwords():
    """Update all user passwords with new defaults"""
    from app.models.orm import User
    
    db = SessionLocal()
    try:
        # Get all users
        users = db.query(User).all()
        
        if not users:
            print("No users found in database")
            return
        
        updated_count = 0
        for user in users:
            if user.username in passwords:
                new_password_hash = pwd_context.hash(passwords[user.username])
                user.password_hash = new_password_hash
                updated_count += 1
                print(f"Updated: {user.username} ({user.role})")
            else:
                print(f"Skipped: {user.username} (no password mapping)")
        
        db.commit()
        print(f"\n✓ Successfully updated {updated_count} user password(s)")
        
    except Exception as e:
        print(f"Error updating passwords: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Updating user passwords in Render database...")
    update_user_passwords()
