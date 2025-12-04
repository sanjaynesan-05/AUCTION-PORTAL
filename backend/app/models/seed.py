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
        
        # Young Indian Talents
        {"id": 21, "name": "Abhishek Sharma", "role": "Batsman", "base_price": 90, "nationality": "India", "age": 24, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/19.png", "stats": {"matches": 45, "runs": 1456, "average": 32.35, "strikeRate": 148.34}},
        {"id": 22, "name": "Arjun Tendulkar", "role": "All-rounder", "base_price": 75, "nationality": "India", "age": 23, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/20.png", "stats": {"matches": 15, "runs": 234, "wickets": 8, "average": 29.25, "strikeRate": 125.67}},
        {"id": 23, "name": "Tilak Varma", "role": "Batsman", "base_price": 85, "nationality": "India", "age": 22, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/21.png", "stats": {"matches": 34, "runs": 1289, "average": 37.89, "strikeRate": 139.45}},
        {"id": 24, "name": "Yashasvi Jaiswal", "role": "Batsman", "base_price": 88, "nationality": "India", "age": 21, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/22.png", "stats": {"matches": 28, "runs": 987, "average": 35.25, "strikeRate": 141.23}},
        {"id": 25, "name": "Mahipal Lomror", "role": "Batsman", "base_price": 70, "nationality": "India", "age": 24, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/23.png", "stats": {"matches": 42, "runs": 1234, "average": 29.38, "strikeRate": 145.67}},
        
        # More Bowlers
        {"id": 26, "name": "Varun Chakaravarthy", "role": "Bowler", "base_price": 110, "nationality": "India", "age": 31, "bowling_style": "Right-arm leg-spin", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/24.png", "stats": {"matches": 76, "wickets": 89, "average": 27.34, "strikeRate": 20.67}},
        {"id": 27, "name": "Navdeep Saini", "role": "Bowler", "base_price": 95, "nationality": "India", "age": 29, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/25.png", "stats": {"matches": 64, "wickets": 79, "average": 28.45, "strikeRate": 21.34}},
        {"id": 28, "name": "Avesh Khan", "role": "Bowler", "base_price": 100, "nationality": "India", "age": 26, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/26.png", "stats": {"matches": 52, "wickets": 71, "average": 26.78, "strikeRate": 19.45}},
        {"id": 29, "name": "Prasidh Krishna", "role": "Bowler", "base_price": 92, "nationality": "India", "age": 26, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/27.png", "stats": {"matches": 38, "runs": 234, "wickets": 52, "average": 28.34, "strikeRate": 20.12}},
        {"id": 30, "name": "Umran Malik", "role": "Bowler", "base_price": 88, "nationality": "India", "age": 24, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/29.png", "stats": {"matches": 28, "wickets": 36, "average": 26.45, "strikeRate": 18.67}},
        
        # More Batsmen
        {"id": 31, "name": "Sanju Samson", "role": "Batsman", "base_price": 125, "nationality": "India", "age": 28, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/30.png", "stats": {"matches": 145, "runs": 4567, "average": 31.56, "strikeRate": 137.89}},
        {"id": 32, "name": "Ajinkya Rahane", "role": "Batsman", "base_price": 80, "nationality": "India", "age": 35, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/31.png", "stats": {"matches": 178, "runs": 4823, "average": 28.67, "strikeRate": 121.45}},
        {"id": 33, "name": "Manish Pandey", "role": "Batsman", "base_price": 75, "nationality": "India", "age": 35, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/32.png", "stats": {"matches": 168, "runs": 4567, "average": 28.34, "strikeRate": 128.34}},
        {"id": 34, "name": "Shreyas Iyer", "role": "Batsman", "base_price": 110, "nationality": "India", "age": 28, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/33.png", "stats": {"matches": 123, "runs": 3876, "average": 31.56, "strikeRate": 139.23}},
        {"id": 35, "name": "Aiden Markram", "role": "Batsman", "base_price": 95, "nationality": "South Africa", "age": 28, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/34.png", "stats": {"matches": 67, "runs": 2234, "average": 33.34, "strikeRate": 135.45}},
        
        # All-rounders
        {"id": 36, "name": "Ravindra Jadeja", "role": "All-rounder", "base_price": 130, "nationality": "India", "age": 34, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/35.png", "stats": {"matches": 189, "runs": 3543, "wickets": 145, "average": 32.34, "strikeRate": 134.56}},
        {"id": 37, "name": "Sam Curran", "role": "All-rounder", "base_price": 105, "nationality": "England", "age": 25, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/36.png", "stats": {"matches": 48, "runs": 1234, "wickets": 52, "average": 28.45, "strikeRate": 143.45}},
        {"id": 38, "name": "Marcus Stoinis", "role": "All-rounder", "base_price": 98, "nationality": "Australia", "age": 34, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/37.png", "stats": {"matches": 89, "runs": 2876, "wickets": 78, "average": 32.34, "strikeRate": 142.56}},
        {"id": 39, "name": "Andre Russell", "role": "All-rounder", "base_price": 115, "nationality": "West Indies", "age": 36, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/38.png", "stats": {"matches": 156, "runs": 3987, "wickets": 123, "average": 34.56, "strikeRate": 178.23}},
        {"id": 40, "name": "Axar Patel", "role": "All-rounder", "base_price": 100, "nationality": "India", "age": 29, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/39.png", "stats": {"matches": 98, "runs": 2345, "wickets": 87, "average": 27.34, "strikeRate": 138.45}},
        
        # Overseas Fast Bowlers
        {"id": 41, "name": "Jofra Archer", "role": "Bowler", "base_price": 120, "nationality": "England", "age": 28, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/40.png", "stats": {"matches": 54, "wickets": 71, "average": 24.67, "strikeRate": 18.34}},
        {"id": 42, "name": "Kagiso Rabada", "role": "Bowler", "base_price": 110, "nationality": "South Africa", "age": 28, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/41.png", "stats": {"matches": 67, "wickets": 91, "average": 26.34, "strikeRate": 19.23}},
        {"id": 43, "name": "Anrich Nortje", "role": "Bowler", "base_price": 105, "nationality": "South Africa", "age": 28, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/42.png", "stats": {"matches": 42, "wickets": 58, "average": 25.34, "strikeRate": 18.78}},
        {"id": 44, "name": "Lungi Ngidi", "role": "Bowler", "base_price": 95, "nationality": "South Africa", "age": 27, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/43.png", "stats": {"matches": 38, "wickets": 49, "average": 27.34, "strikeRate": 20.45}},
        {"id": 45, "name": "Mark Wood", "role": "Bowler", "base_price": 100, "nationality": "England", "age": 35, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/44.png", "stats": {"matches": 34, "wickets": 48, "average": 26.78, "strikeRate": 19.34}},
        
        # Overseas Batsmen
        {"id": 46, "name": "Virat Kohli", "role": "Batsman", "base_price": 120, "nationality": "New Zealand", "age": 30, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/45.png", "stats": {"matches": 142, "runs": 4876, "average": 34.69, "strikeRate": 140.23}},
        {"id": 47, "name": "Glenn Maxwell", "role": "Batsman", "base_price": 105, "nationality": "Australia", "age": 35, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/46.png", "stats": {"matches": 178, "runs": 5234, "average": 29.63, "strikeRate": 162.34}},
        {"id": 48, "name": "Jos Buttler", "role": "Wicketkeeper", "base_price": 112, "nationality": "England", "age": 33, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/47.png", "stats": {"matches": 96, "runs": 3456, "average": 36.0, "strikeRate": 145.67}},
        {"id": 49, "name": "Liam Livingstone", "role": "Batsman", "base_price": 92, "nationality": "England", "age": 30, "batting_style": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/48.png", "stats": {"matches": 67, "runs": 2145, "average": 32.04, "strikeRate": 148.34}},
        {"id": 50, "name": "Colin Munro", "role": "Batsman", "base_price": 80, "nationality": "New Zealand", "age": 35, "batting_style": "Left-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/49.png", "stats": {"matches": 123, "runs": 3876, "average": 31.56, "strikeRate": 145.67}},
        
        # Additional Indian Bowlers
        {"id": 51, "name": "Deepak Chahar", "role": "Bowler", "base_price": 85, "nationality": "India", "age": 30, "bowling_style": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/50.png", "stats": {"matches": 52, "wickets": 71, "average": 28.45, "strikeRate": 21.34}},
        {"id": 52, "name": "Ismaily Khan", "role": "Bowler", "base_price": 78, "nationality": "India", "age": 28, "bowling_style": "Left-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/51.png", "stats": {"matches": 38, "wickets": 49, "average": 27.34, "strikeRate": 20.12}},
        {"id": 53, "name": "T Natarajan", "role": "Bowler", "base_price": 82, "nationality": "India", "age": 31, "bowling_style": "Left-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/52.png", "stats": {"matches": 45, "wickets": 61, "average": 28.34, "strikeRate": 19.78}},
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
    """Seed users into database - Load from environment variables in production"""
    import os
    
    # Get credentials from environment variables (with safe defaults for development only)
    # NOTE: In production, these MUST be loaded from secure environment variables
    default_admin_pwd = os.getenv("ADMIN_PASSWORD", "change-me-in-production")
    default_presenter_pwd = os.getenv("PRESENTER_PASSWORD", "change-me-in-production")
    
    mock_users = [
        # Admin & Presenter - PASSWORDS MUST BE SET VIA ENVIRONMENT VARIABLES
        {"id": "admin", "username": "admin", "password": default_admin_pwd, "role": "admin"},
        {"id": "presenter", "username": "presenter", "password": default_presenter_pwd, "role": "presenter"},
        
        # 10 Team Representatives - PASSWORDS MUST BE SET VIA ENVIRONMENT VARIABLES
        {"id": "team-csk", "username": "csk", "password": os.getenv("TEAM_CSK_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 1, "team_name": "Chennai Super Kings"},
        {"id": "team-mi", "username": "mi", "password": os.getenv("TEAM_MI_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 2, "team_name": "Mumbai Indians"},
        {"id": "team-rcb", "username": "rcb", "password": os.getenv("TEAM_RCB_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 3, "team_name": "Royal Challengers Bangalore"},
        {"id": "team-kkr", "username": "kkr", "password": os.getenv("TEAM_KKR_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 4, "team_name": "Kolkata Knight Riders"},
        {"id": "team-dc", "username": "dc", "password": os.getenv("TEAM_DC_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 5, "team_name": "Delhi Capitals"},
        {"id": "team-rr", "username": "rr", "password": os.getenv("TEAM_RR_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 6, "team_name": "Rajasthan Royals"},
        {"id": "team-pbks", "username": "pbks", "password": os.getenv("TEAM_PBKS_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 7, "team_name": "Punjab Kings"},
        {"id": "team-srh", "username": "srh", "password": os.getenv("TEAM_SRH_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 8, "team_name": "Sunrisers Hyderabad"},
        {"id": "team-gt", "username": "gt", "password": os.getenv("TEAM_GT_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 9, "team_name": "Gujarat Titans"},
        {"id": "team-lsg", "username": "lsg", "password": os.getenv("TEAM_LSG_PASSWORD", "change-me-in-production"), "role": "viewer", "team_id": 10, "team_name": "Lucknow Super Giants"}
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


def safe_seed_database(db: Session):
    """Seed database only if data doesn't already exist - prevents re-seeding on every deployment"""
    from app.models.orm import Team, Player, User, AuctionState
    
    teams_count = db.query(Team).count()
    players_count = db.query(Player).count()
    users_count = db.query(User).count()
    auction_state_count = db.query(AuctionState).count()
    
    # Only seed if tables are empty
    if teams_count == 0:
        print("Seeding teams...")
        seed_teams(db)
    else:
        print(f"✓ Teams already exist ({teams_count} records) - skipping seed")
    
    if players_count == 0:
        print("Seeding players...")
        seed_players(db)
    else:
        print(f"✓ Players already exist ({players_count} records) - skipping seed")
    
    if users_count == 0:
        print("Seeding users...")
        seed_users(db)
    else:
        print(f"✓ Users already exist ({users_count} records) - skipping seed")
    
    if auction_state_count == 0:
        print("Initializing auction state...")
        init_auction_state(db)
    else:
        print(f"✓ Auction state already exists - skipping initialization")
    
    print("Database seeding check complete!")
