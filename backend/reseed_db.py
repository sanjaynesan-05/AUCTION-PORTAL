import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.orm import Base, User, Team, Player, AuctionStatus, AuctionState
from app.models.seed import seed_teams, seed_players, seed_users
from datetime import datetime, timezone

load_dotenv()
db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)

# Drop all tables
with engine.begin() as conn:
    conn.execute(text("DROP TABLE IF EXISTS players CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS auction_state CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS teams CASCADE"))
print("✅ Tables dropped")

# Create all tables
Base.metadata.create_all(engine)
print("✅ All tables created")

SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

try:
    seed_teams(session)
    print("✅ Teams seeded")
    
    seed_players(session)
    print("✅ Players seeded")
    
    seed_users(session)
    print("✅ Users seeded with correct roles")
    
    # Verify roles
    admin = session.query(User).filter(User.username == "admin").first()
    presenter = session.query(User).filter(User.username == "presenter").first()
    print(f"\n🔍 User Roles:")
    print(f"   Admin: {admin.role if admin else 'NOT FOUND'}")
    print(f"   Presenter: {presenter.role if presenter else 'NOT FOUND'}")
    
    # Create auction state
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
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    session.close()
