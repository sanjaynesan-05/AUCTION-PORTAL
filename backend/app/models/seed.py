"""Database seed and initialization"""
from sqlalchemy.orm import Session
from app.models.orm import User, Player, Team, AuctionState, PlayerStatus, AuctionStatus
from passlib.context import CryptContext
from datetime import datetime, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_teams(db: Session):
    """Seed teams into database - simplified schema"""
    mock_teams = [
        {"id": 1, "name": "Chennai Super Kings", "color": "#FFCC00", "logo": "https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png"},
        {"id": 2, "name": "Mumbai Indians", "color": "#004BA0", "logo": "https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png"},
        {"id": 3, "name": "Royal Challengers Bangalore", "color": "#EC1C24", "logo": "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png"},
        {"id": 4, "name": "Kolkata Knight Riders", "color": "#3A225D", "logo": "https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png"},
        {"id": 5, "name": "Delhi Capitals", "color": "#004C93", "logo": "https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png"},
        {"id": 6, "name": "Rajasthan Royals", "color": "#254AA5", "logo": "https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png"},
        {"id": 7, "name": "Punjab Kings", "color": "#ED1B24", "logo": "https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png"},
        {"id": 8, "name": "Sunrisers Hyderabad", "color": "#FF822A", "logo": "https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png"},
        {"id": 9, "name": "Gujarat Titans", "color": "#1B2631", "logo": "https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png"},
        {"id": 10, "name": "Lucknow Super Giants", "color": "#00A0E3", "logo": "https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png"}
    ]

    for team_data in mock_teams:
        existing = db.query(Team).filter(Team.id == team_data["id"]).first()
        if not existing:
            team = Team(
                id=team_data["id"],
                name=team_data["name"],
                color=team_data["color"],
                logo=team_data.get("logo")
            )
            db.add(team)
    
    db.commit()


def seed_players(db: Session):
    """Seed players into database with PENDING status"""
    mock_players = [
        # Indian Top Order Batsmen
        {"id": 1, "name": "Virat Kohli", "role": "Batsman", "base_price": 200, "nationality": "India", "age": 35, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1.png", "stats": {"matches": 223, "runs": 7263, "average": 37.25, "strikeRate": 131.97}},
        {"id": 2, "name": "Rohit Sharma", "role": "Batsman", "base_price": 190, "nationality": "India", "age": 36, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png", "stats": {"matches": 243, "runs": 6628, "average": 31.17, "strikeRate": 130.39}},
        {"id": 3, "name": "KL Rahul", "role": "Batsman", "base_price": 180, "nationality": "India", "age": 31, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/2.png", "stats": {"matches": 156, "runs": 5368, "average": 35.65, "strikeRate": 128.94}},
        {"id": 4, "name": "Shubman Gill", "role": "Batsman", "base_price": 170, "nationality": "India", "age": 24, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/3.png", "stats": {"matches": 89, "runs": 3422, "average": 38.89, "strikeRate": 135.78}},
        {"id": 5, "name": "Ishan Kishan", "role": "Batsman", "base_price": 150, "nationality": "India", "age": 25, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/4.png", "stats": {"matches": 78, "runs": 2456, "average": 32.45, "strikeRate": 141.23}},
        {"id": 6, "name": "Suryakumar Yadav", "role": "Batsman", "base_price": 160, "nationality": "India", "age": 32, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/5.png", "stats": {"matches": 134, "runs": 4232, "average": 36.78, "strikeRate": 145.67}},
        
        # Wicketkeepers
        {"id": 7, "name": "MS Dhoni", "role": "Wicketkeeper", "base_price": 180, "nationality": "India", "age": 42, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/28.png", "stats": {"matches": 250, "runs": 5243, "average": 39.13, "strikeRate": 135.92}},
        {"id": 8, "name": "Rishabh Pant", "role": "Wicketkeeper", "base_price": 140, "nationality": "India", "age": 26, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/7.png", "stats": {"matches": 92, "runs": 3121, "average": 35.23, "strikeRate": 147.89}},
        
        # Fast Bowlers
        {"id": 9, "name": "Jasprit Bumrah", "role": "Bowler", "base_price": 150, "nationality": "India", "age": 30, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/8.png", "stats": {"matches": 120, "wickets": 165, "average": 24.43, "strikeRate": 19.17}},
        {"id": 10, "name": "Mohammed Shami", "role": "Bowler", "base_price": 130, "nationality": "India", "age": 33, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/9.png", "stats": {"matches": 98, "wickets": 128, "average": 26.34, "strikeRate": 20.45}},
        {"id": 11, "name": "Siraj", "role": "Bowler", "base_price": 120, "nationality": "India", "age": 29, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/10.png", "stats": {"matches": 87, "wickets": 109, "average": 27.89, "strikeRate": 21.34}},
        {"id": 12, "name": "Hardik Pandya", "role": "All-rounder", "base_price": 140, "nationality": "India", "age": 30, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/11.png", "stats": {"matches": 156, "runs": 3987, "wickets": 92, "average": 28.34, "strikeRate": 145.67}},
        
        # Spinners
        {"id": 13, "name": "Rashid Khan", "role": "Bowler", "base_price": 140, "nationality": "Afghanistan", "age": 25, "bowling_style": "Right-arm leg-spin", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/109.png", "stats": {"matches": 76, "wickets": 93, "average": 24.34, "strikeRate": 18.94}},
        {"id": 14, "name": "Ravichandran Ashwin", "role": "Bowler", "base_price": 135, "nationality": "India", "age": 36, "bowling_style": "Right-arm off-spin", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/12.png", "stats": {"matches": 167, "wickets": 174, "average": 28.67, "strikeRate": 22.45}},
        {"id": 15, "name": "Yuzvendra Chahal", "role": "Bowler", "base_price": 125, "nationality": "India", "age": 32, "bowling_style": "Right-arm leg-spin", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/13.png", "stats": {"matches": 156, "wickets": 178, "average": 26.45, "strikeRate": 21.23}},
        
        # International Players
        {"id": 16, "name": "Pat Cummins", "role": "Bowler", "base_price": 110, "nationality": "Australia", "age": 31, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/14.png", "stats": {"matches": 42, "wickets": 56, "average": 25.34, "strikeRate": 19.78}},
        {"id": 17, "name": "David Warner", "role": "Batsman", "base_price": 100, "nationality": "Australia", "age": 37, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/15.png", "stats": {"matches": 188, "runs": 6589, "average": 40.23, "strikeRate": 139.45}},
        {"id": 18, "name": "Quinton de Kock", "role": "Wicketkeeper", "base_price": 110, "nationality": "South Africa", "age": 31, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/16.png", "stats": {"matches": 89, "runs": 2987, "average": 35.67, "strikeRate": 142.34}},
        {"id": 19, "name": "Reece Topley", "role": "Bowler", "base_price": 105, "nationality": "England", "age": 29, "bowling_style": "Left-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/17.png", "stats": {"matches": 34, "wickets": 48, "average": 24.78, "strikeRate": 18.67}},
        {"id": 20, "name": "Marco Jansen", "role": "All-rounder", "base_price": 95, "nationality": "South Africa", "age": 24, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/18.png", "stats": {"matches": 28, "runs": 876, "wickets": 34, "average": 18.45, "strikeRate": 142.56}},
    ]

    for player_data in mock_players:
        existing = db.query(Player).filter(Player.id == player_data["id"]).first()
        if not existing:
            player = Player(
                id=player_data["id"],
                name=player_data["name"],
                role=player_data["role"],
                base_price=player_data["base_price"],
                nationality=player_data["nationality"],
                age=player_data["age"],
                batting_style=player_data.get("batting_style"),
                bowling_style=player_data.get("bowling_style"),
                image=player_data["image"],
                stats=player_data.get("stats"),
                status=PlayerStatus.PENDING  # All players start as PENDING
            )
            db.add(player)
    
    db.commit()


def seed_users(db: Session):
    """Seed admin and presenter users"""
    import os
    
    # Get admin password from env or use default
    default_admin_pwd = os.getenv("ADMIN_PASSWORD", "auction123")
    
    mock_users = [
        {"id": "admin", "username": "admin", "password": default_admin_pwd, "role": "admin"},
        {"id": "presenter", "username": "presenter", "password": default_admin_pwd, "role": "presenter"},  # Presenter has read-only access
    ]

    for user_data in mock_users:
        existing = db.query(User).filter(User.id == user_data["id"]).first()
        if not existing:
            try:
                user = User(
                    id=user_data["id"],
                    username=user_data["username"],
                    password_hash=pwd_context.hash(user_data["password"]),
                    role=user_data["role"]
                )
                db.add(user)
            except Exception as e:
                print(f"  ✗ Error creating user {user_data['username']}: {e}")
                db.rollback()
                continue
    
    db.commit()


def init_auction_state(db: Session):
    """Initialize auction state singleton"""
    existing = db.query(AuctionState).filter(AuctionState.id == 1).first()
    if not existing:
        state = AuctionState(
            id=1,
            status=AuctionStatus.IDLE,
            current_bid=0
        )
        db.add(state)
        db.commit()


def safe_seed_database(db: Session):
    """Seed database on startup - only seed if empty"""
    teams_count = db.query(Team).count()
    players_count = db.query(Player).count()
    users_count = db.query(User).count()
    
    # Only seed if tables are empty
    if teams_count == 0:
        print("📋 Seeding teams...")
        seed_teams(db)
    else:
        print(f"✓ Teams already exist ({teams_count} records)")
    
    if players_count == 0:
        print("📋 Seeding players...")
        seed_players(db)
    else:
        print(f"✓ Players already exist ({players_count} records)")
    
    if users_count == 0:
        print("📋 Seeding admin users...")
        try:
            seed_users(db)
            print("✓ Admin users seeded successfully")
        except Exception as e:
            print(f"✗ Error seeding users: {e}")
            db.rollback()
    else:
        print(f"✓ Users already exist ({users_count} records)")
    
    print("📋 Initializing auction state...")
    init_auction_state(db)
    
    print("✓ Database seeding complete!")
