import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.orm import Base, User, Team, Player, PlayerStatus, AuctionStatus, AuctionState
from app.models.seed import seed_teams, seed_players, seed_users
from datetime import datetime, timezone

# Load environment
load_dotenv()

# Create database session
db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)

# First, recreate auction_state table
print("Creating auction_state table...")
Base.metadata.tables['auction_state'].create(engine, checkfirst=True)
print("✅ auction_state table created")

SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

try:
    print("🌱 Seeding database...")
    
    # Seed data
    seed_teams(session)
    print("✅ Teams seeded")
    
    seed_players(session)
    print("✅ Players seeded")
    
    seed_users(session)
    print("✅ Users seeded")
    
    # Create initial auction state
    auction_state = AuctionState(
        status=AuctionStatus.IDLE,
        current_bid=0,
        current_player_id=None,
        winning_team_id=None,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    session.add(auction_state)
    session.commit()
    print("✅ Auction state created")
    print("✅ Auction state seeded")
    
    # Verify
    team_count = session.query(Team).count()
    player_count = session.query(Player).count()
    user_count = session.query(User).count()
    
    print(f"\n📊 Database Summary:")
    print(f"   Teams: {team_count}")
    print(f"   Players: {player_count}")
    print(f"   Users: {user_count}")
    print(f"\n✅ Database seeding complete!")
    
except Exception as e:
    print(f"❌ Seeding error: {e}")
    import traceback
    traceback.print_exc()
finally:
    session.close()
