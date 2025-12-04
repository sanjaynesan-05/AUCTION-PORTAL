#!/usr/bin/env python3
"""
Direct database reset script - deletes all users to force reseeding with new passwords
This is for development/testing only to fix password hash mismatches
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL environment variable not set")
    print("Cannot reset database without connection string")
    sys.exit(1)

print(f"Connecting to database: {DATABASE_URL[:50]}...")

try:
    # Create engine and session
    engine = create_engine(DATABASE_URL, echo=True)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    print("\n=== DELETING ALL USERS ===")
    
    # Delete all users
    result = session.execute(text("DELETE FROM \"user\""))
    deleted_count = result.rowcount
    
    print(f"✓ Deleted {deleted_count} users from database")
    
    # Commit changes
    session.commit()
    print("✓ Changes committed")
    
    # Verify deletion
    result = session.execute(text("SELECT COUNT(*) FROM \"user\""))
    remaining = result.scalar()
    print(f"✓ Verification: {remaining} users remaining in database")
    
    session.close()
    print("\n=== SUCCESS ===")
    print("All users have been deleted.")
    print("Next deployment will reseed with new passwords: 'auction123'")
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
