"""Database seed and initialization"""
from sqlalchemy.orm import Session
from app.models.orm import User, Player, Team, AuctionState
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_teams(db: Session):
    """Seed teams into database"""
    mock_teams = [
        {"id": 1, "name": "Chennai Super Kings", "short_name": "CSK", "logo": "https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png", "color": "#FFCC00", "primary_color": "#FFCC00", "secondary_color": "#003366"},
        {"id": 2, "name": "Mumbai Indians", "short_name": "MI", "logo": "https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png", "color": "#004BA0", "primary_color": "#004BA0", "secondary_color": "#FFD700"},
        {"id": 3, "name": "Royal Challengers Bangalore", "short_name": "RCB", "logo": "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png", "color": "#EC1C24", "primary_color": "#EC1C24", "secondary_color": "#FFD700"},
        {"id": 4, "name": "Kolkata Knight Riders", "short_name": "KKR", "logo": "https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png", "color": "#3A225D", "primary_color": "#3A225D", "secondary_color": "#FFD700"},
        {"id": 5, "name": "Delhi Capitals", "short_name": "DC", "logo": "https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png", "color": "#004C93", "primary_color": "#004C93", "secondary_color": "#DC143C"},
        {"id": 6, "name": "Rajasthan Royals", "short_name": "RR", "logo": "https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png", "color": "#254AA5", "primary_color": "#254AA5", "secondary_color": "#FFB6C1"},
        {"id": 7, "name": "Punjab Kings", "short_name": "PBKS", "logo": "https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png", "color": "#ED1B24", "primary_color": "#ED1B24", "secondary_color": "#FFD700"},
        {"id": 8, "name": "Sunrisers Hyderabad", "short_name": "SRH", "logo": "https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png", "color": "#FF822A", "primary_color": "#FF822A", "secondary_color": "#000000"},
        {"id": 9, "name": "Gujarat Titans", "short_name": "GT", "logo": "https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png", "color": "#1B2631", "primary_color": "#1B2631", "secondary_color": "#FFD700"},
        {"id": 10, "name": "Lucknow Super Giants", "short_name": "LSG", "logo": "https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png", "color": "#00A0E3", "primary_color": "#00A0E3", "secondary_color": "#FFD700"}
    ]

    for team_data in mock_teams:
        existing = db.query(Team).filter(Team.id == team_data["id"]).first()
        if not existing:
            team = Team(
                id=team_data["id"],
                name=team_data["name"],
                short_name=team_data["short_name"],
                initial_purse=12000,
                remaining_purse=12000,
                logo=team_data["logo"],
                color=team_data["color"],
                primary_color=team_data["primary_color"],
                secondary_color=team_data["secondary_color"]
            )
            db.add(team)
    
    db.commit()


def seed_players(db: Session):
    """Seed players into database"""
    mock_players = [
        {"id": 1, "name": "Virat Kohli", "role": "Batsman", "base_price": 200, "nationality": "India", "age": 35, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1.png", "stats": {"matches": 223, "runs": 7263, "average": 37.25, "strikeRate": 131.97}},
        {"id": 2, "name": "Jasprit Bumrah", "role": "Bowler", "base_price": 150, "nationality": "India", "age": 30, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/8.png", "stats": {"matches": 120, "wickets": 165, "average": 24.43, "strikeRate": 19.17}},
        {"id": 3, "name": "MS Dhoni", "role": "Wicketkeeper", "base_price": 180, "nationality": "India", "age": 42, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/28.png", "stats": {"matches": 250, "runs": 5243, "average": 39.13, "strikeRate": 135.92}},
        {"id": 4, "name": "Rohit Sharma", "role": "Batsman", "base_price": 190, "nationality": "India", "age": 36, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png", "stats": {"matches": 243, "runs": 6628, "average": 31.17, "strikeRate": 130.39}},
        {"id": 5, "name": "Rashid Khan", "role": "Bowler", "base_price": 140, "nationality": "Afghanistan", "age": 25, "bowling_style": "Right-arm leg-spin", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/109.png", "stats": {"matches": 76, "wickets": 93, "average": 24.34, "strikeRate": 18.94}}
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
                sold=False
            )
            db.add(player)
    
    db.commit()


def seed_users(db: Session):
    """Seed users into database - All 12 credentials (Admin, Presenter, 10 Teams)"""
    mock_users = [
        # Admin & Presenter
        {"id": "admin", "username": "admin", "password": "admin@123", "role": "admin"},
        {"id": "presenter", "username": "presenter", "password": "presenter@123", "role": "presenter"},
        
        # 10 Team Representatives
        {"id": "team-csk", "username": "csk", "password": "csk@123", "role": "viewer", "team_id": 1, "team_name": "Chennai Super Kings"},
        {"id": "team-mi", "username": "mi", "password": "mi@123", "role": "viewer", "team_id": 2, "team_name": "Mumbai Indians"},
        {"id": "team-rcb", "username": "rcb", "password": "rcb@123", "role": "viewer", "team_id": 3, "team_name": "Royal Challengers Bangalore"},
        {"id": "team-kkr", "username": "kkr", "password": "kkr@123", "role": "viewer", "team_id": 4, "team_name": "Kolkata Knight Riders"},
        {"id": "team-dc", "username": "dc", "password": "dc@123", "role": "viewer", "team_id": 5, "team_name": "Delhi Capitals"},
        {"id": "team-rr", "username": "rr", "password": "rr@123", "role": "viewer", "team_id": 6, "team_name": "Rajasthan Royals"},
        {"id": "team-pbks", "username": "pbks", "password": "pbks@123", "role": "viewer", "team_id": 7, "team_name": "Punjab Kings"},
        {"id": "team-srh", "username": "srh", "password": "srh@123", "role": "viewer", "team_id": 8, "team_name": "Sunrisers Hyderabad"},
        {"id": "team-gt", "username": "gt", "password": "gt@123", "role": "viewer", "team_id": 9, "team_name": "Gujarat Titans"},
        {"id": "team-lsg", "username": "lsg", "password": "lsg@123", "role": "viewer", "team_id": 10, "team_name": "Lucknow Super Giants"}
    ]

    for user_data in mock_users:
        existing = db.query(User).filter(User.id == user_data["id"]).first()
        if not existing:
            user = User(
                id=user_data["id"],
                username=user_data["username"],
                password_hash=pwd_context.hash(user_data["password"]),
                role=user_data["role"],
                team_id=user_data.get("team_id"),
                team_name=user_data.get("team_name")
            )
            db.add(user)
    
    db.commit()


def init_auction_state(db: Session):
    """Initialize auction state"""
    existing = db.query(AuctionState).first()
    if not existing:
        state = AuctionState(
            current_index=0,
            auction_started=False,
            auction_paused=False,
            current_bid=0
        )
        db.add(state)
        db.commit()


def seed_database(db: Session):
    """Seed all data into database"""
    print("Seeding teams...")
    seed_teams(db)
    print("Seeding players...")
    seed_players(db)
    print("Seeding users...")
    seed_users(db)
    print("Initializing auction state...")
    init_auction_state(db)
    print("Database seeded successfully!")
