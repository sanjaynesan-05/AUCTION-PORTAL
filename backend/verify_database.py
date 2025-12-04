#!/usr/bin/env python
"""
Database Verification Script
Checks database connectivity and verifies all schemas/models are created
"""

import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import inspect, text
from app.database import engine, init_db, SessionLocal
from app.models.orm import Base, User, Player, Team, AuctionState, BidHistory
from app.models.seed import seed_database

def check_database_connection():
    """Check if database connection is working"""
    print("\n" + "="*60)
    print("DATABASE CONNECTIVITY CHECK")
    print("="*60)
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            result.fetchone()
            print("✅ Database Connection: SUCCESSFUL")
            return True
    except Exception as e:
        print(f"❌ Database Connection: FAILED")
        print(f"   Error: {e}")
        return False

def check_tables():
    """Check if all tables exist in database"""
    print("\n" + "="*60)
    print("DATABASE TABLES CHECK")
    print("="*60)
    
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    
    expected_tables = {
        'users',
        'players',
        'teams',
        'auction_state',
        'bid_history',
        'team_players'
    }
    
    print(f"\nExpected Tables: {sorted(expected_tables)}")
    print(f"Existing Tables: {sorted(existing_tables)}")
    
    missing_tables = expected_tables - existing_tables
    
    if not missing_tables:
        print("\n✅ All Tables Exist: YES")
        return True
    else:
        print(f"\n❌ Missing Tables: {sorted(missing_tables)}")
        return False

def check_columns():
    """Check if all columns exist in tables"""
    print("\n" + "="*60)
    print("DATABASE COLUMNS CHECK")
    print("="*60)
    
    inspector = inspect(engine)
    
    expected_columns = {
        'users': ['id', 'username', 'password_hash', 'role', 'team_id', 'created_at'],
        'players': ['id', 'name', 'role', 'base_price', 'sold', 'team_id', 'price'],
        'teams': ['id', 'name', 'short_name', 'initial_purse', 'remaining_purse'],
        'auction_state': ['id', 'current_index', 'current_player_id', 'auction_started', 'auction_paused'],
        'bid_history': ['id', 'player_id', 'team_id', 'amount', 'bid_time']
    }
    
    all_columns_ok = True
    
    for table_name, expected_cols in expected_columns.items():
        print(f"\nTable: {table_name}")
        try:
            existing_cols = set(col['name'] for col in inspector.get_columns(table_name))
            expected_set = set(expected_cols)
            
            present = expected_set & existing_cols
            missing = expected_set - existing_cols
            
            print(f"  Expected: {sorted(expected_cols)}")
            print(f"  Present:  {sorted(present)}")
            
            if missing:
                print(f"  ❌ Missing: {sorted(missing)}")
                all_columns_ok = False
            else:
                print(f"  ✅ All columns present")
        except Exception as e:
            print(f"  ❌ Error checking table: {e}")
            all_columns_ok = False
    
    return all_columns_ok

def check_data():
    """Check if database has seed data"""
    print("\n" + "="*60)
    print("DATABASE DATA CHECK")
    print("="*60)
    
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        player_count = db.query(Player).count()
        team_count = db.query(Team).count()
        bid_count = db.query(BidHistory).count()
        
        print(f"\nData Statistics:")
        print(f"  Users:        {user_count}")
        print(f"  Players:      {player_count}")
        print(f"  Teams:        {team_count}")
        print(f"  Bid Records:  {bid_count}")
        
        if user_count > 0 and team_count > 0 and player_count > 0:
            print("\n✅ Database has seed data: YES")
            return True
        else:
            print("\n⚠️  Database appears empty - may need seeding")
            return False
    except Exception as e:
        print(f"❌ Error checking data: {e}")
        return False
    finally:
        db.close()

def init_database():
    """Initialize database tables"""
    print("\n" + "="*60)
    print("DATABASE INITIALIZATION")
    print("="*60)
    
    try:
        print("\nCreating tables...")
        init_db()
        print("✅ Tables created successfully")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

def seed_db():
    """Seed database with mock data"""
    print("\n" + "="*60)
    print("DATABASE SEEDING")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\nSeeding database with mock data...")
        seed_database(db)
        print("✅ Database seeded successfully")
        return True
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        return False
    finally:
        db.close()

def main():
    """Run all checks"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + "  IPL AUCTION PORTAL - DATABASE VERIFICATION SCRIPT".center(58) + "║")
    print("╚" + "="*58 + "╝")
    
    # Check connection
    connection_ok = check_database_connection()
    
    if not connection_ok:
        print("\n❌ Cannot proceed without database connection!")
        sys.exit(1)
    
    # Check and initialize if needed
    tables_ok = check_tables()
    
    if not tables_ok:
        print("\n⚠️  Creating missing tables...")
        if init_database():
            tables_ok = True
    
    # Check columns
    columns_ok = check_columns()
    
    # Check data
    data_ok = check_data()
    
    if not data_ok:
        print("\n⚠️  Seeding database with initial data...")
        seed_db()
    
    # Final summary
    print("\n" + "="*60)
    print("FINAL SUMMARY")
    print("="*60)
    
    summary = {
        "Database Connection": "✅ OK" if connection_ok else "❌ FAILED",
        "Tables Exist": "✅ OK" if tables_ok else "❌ FAILED",
        "Columns Present": "✅ OK" if columns_ok else "❌ FAILED",
        "Seed Data Present": "✅ OK" if data_ok else "⚠️  EMPTY (but can be seeded)"
    }
    
    for check, status in summary.items():
        print(f"{check:.<40} {status}")
    
    print("\n" + "="*60)
    
    if connection_ok and tables_ok and columns_ok:
        print("✅ DATABASE IS READY TO USE!")
        print("\nYou can now start the backend with:")
        print("  python -m uvicorn app.main:app --reload")
        print("="*60 + "\n")
        return 0
    else:
        print("❌ DATABASE HAS ISSUES - See details above")
        print("="*60 + "\n")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
