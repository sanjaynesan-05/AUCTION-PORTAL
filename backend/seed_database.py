"""
Database Seeding Script - Populate NEON with IPL teams and players
"""
from config.database import SessionLocal, init_db
from models.models import Team, Player, PlayerRole
from datetime import datetime

def seed_teams(db):
    """Seed IPL teams"""
    teams_data = [
        {
            "name": "Chennai Super Kings",
            "short_name": "CSK",
            "logo_url": "https://ui-avatars.com/api/?name=CSK&background=FFCD39&color=fff&size=200",
            "color": "#FFCD39",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Mumbai Indians",
            "short_name": "MI",
            "logo_url": "https://ui-avatars.com/api/?name=MI&background=004687&color=fff&size=200",
            "color": "#004687",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Royal Challengers Bangalore",
            "short_name": "RCB",
            "logo_url": "https://ui-avatars.com/api/?name=RCB&background=EC1C24&color=fff&size=200",
            "color": "#EC1C24",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Kolkata Knight Riders",
            "short_name": "KKR",
            "logo_url": "https://ui-avatars.com/api/?name=KKR&background=2E1788&color=fff&size=200",
            "color": "#2E1788",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Rajasthan Royals",
            "short_name": "RR",
            "logo_url": "https://ui-avatars.com/api/?name=RR&background=EC1B8B&color=fff&size=200",
            "color": "#EC1B8B",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Sunrisers Hyderabad",
            "short_name": "SRH",
            "logo_url": "https://ui-avatars.com/api/?name=SRH&background=FF7A00&color=fff&size=200",
            "color": "#FF7A00",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Delhi Capitals",
            "short_name": "DC",
            "logo_url": "https://ui-avatars.com/api/?name=DC&background=004B87&color=fff&size=200",
            "color": "#004B87",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Punjab Kings",
            "short_name": "PBKS",
            "logo_url": "https://ui-avatars.com/api/?name=PBKS&background=C41E3A&color=fff&size=200",
            "color": "#C41E3A",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Gujarat Titans",
            "short_name": "GT",
            "logo_url": "https://ui-avatars.com/api/?name=GT&background=095C8B&color=fff&size=200",
            "color": "#095C8B",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        },
        {
            "name": "Lucknow Super Giants",
            "short_name": "LSG",
            "logo_url": "https://ui-avatars.com/api/?name=LSG&background=004687&color=fff&size=200",
            "color": "#004687",
            "total_purse": 1200.0,
            "remaining_purse": 1200.0
        }
    ]
    
    for team_data in teams_data:
        team = db.query(Team).filter(Team.short_name == team_data["short_name"]).first()
        if not team:
            team = Team(**team_data)
            db.add(team)
    
    db.commit()
    print("✅ Teams seeded")

def seed_players(db):
    """Seed IPL players"""
    players_data = [
        # CSK Players
        {"name": "Virat Kohli", "role": PlayerRole.BATSMAN, "nationality": "India", "age": 35, "base_price": 2.0, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=Virat+Kohli&size=200"},
        {"name": "Rohit Sharma", "role": PlayerRole.BATSMAN, "nationality": "India", "age": 36, "base_price": 2.0, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=Rohit+Sharma&size=200"},
        {"name": "MS Dhoni", "role": PlayerRole.WICKETKEEPER, "nationality": "India", "age": 42, "base_price": 2.0, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=MS+Dhoni&size=200"},
        {"name": "Jasprit Bumrah", "role": PlayerRole.BOWLER, "nationality": "India", "age": 30, "base_price": 2.0, "bowling_style": "Fast", "image_url": "https://ui-avatars.com/api/?name=Jasprit+Bumrah&size=200"},
        {"name": "Rashid Khan", "role": PlayerRole.BOWLER, "nationality": "Afghanistan", "age": 25, "base_price": 2.0, "bowling_style": "Leg-break", "image_url": "https://ui-avatars.com/api/?name=Rashid+Khan&size=200"},
        
        # MI Players
        {"name": "Hardik Pandya", "role": PlayerRole.ALL_ROUNDER, "nationality": "India", "age": 30, "base_price": 1.5, "batting_style": "Right-hand", "bowling_style": "Fast", "image_url": "https://ui-avatars.com/api/?name=Hardik+Pandya&size=200"},
        {"name": "Suryakumar Yadav", "role": PlayerRole.BATSMAN, "nationality": "India", "age": 33, "base_price": 1.5, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=Suryakumar+Yadav&size=200"},
        {"name": "Ishan Kishan", "role": PlayerRole.WICKETKEEPER, "nationality": "India", "age": 26, "base_price": 1.5, "batting_style": "Left-hand", "image_url": "https://ui-avatars.com/api/?name=Ishan+Kishan&size=200"},
        {"name": "Jitu Mishra", "role": PlayerRole.BOWLER, "nationality": "India", "age": 28, "base_price": 1.0, "bowling_style": "Left-arm Orthodox", "image_url": "https://ui-avatars.com/api/?name=Jitu+Mishra&size=200"},
        {"name": "Tim David", "role": PlayerRole.BATSMAN, "nationality": "Australia", "age": 28, "base_price": 1.0, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=Tim+David&size=200"},
        
        # RCB Players
        {"name": "Faf du Plessis", "role": PlayerRole.BATSMAN, "nationality": "South Africa", "age": 39, "base_price": 1.5, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=Faf+du+Plessis&size=200"},
        {"name": "Maxwell", "role": PlayerRole.ALL_ROUNDER, "nationality": "Australia", "age": 35, "base_price": 1.5, "batting_style": "Right-hand", "bowling_style": "Off-break", "image_url": "https://ui-avatars.com/api/?name=Glenn+Maxwell&size=200"},
        {"name": "Mohammad Siraj", "role": PlayerRole.BOWLER, "nationality": "India", "age": 29, "base_price": 1.5, "bowling_style": "Fast", "image_url": "https://ui-avatars.com/api/?name=Mohammad+Siraj&size=200"},
        {"name": "Anuj Rawat", "role": PlayerRole.WICKETKEEPER, "nationality": "India", "age": 25, "base_price": 1.0, "batting_style": "Left-hand", "image_url": "https://ui-avatars.com/api/?name=Anuj+Rawat&size=200"},
        {"name": "Yash Dayal", "role": PlayerRole.BOWLER, "nationality": "India", "age": 26, "base_price": 1.0, "bowling_style": "Fast", "image_url": "https://ui-avatars.com/api/?name=Yash+Dayal&size=200"},
        
        # KKR Players
        {"name": "Shreyas Iyer", "role": PlayerRole.BATSMAN, "nationality": "India", "age": 28, "base_price": 1.5, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=Shreyas+Iyer&size=200"},
        {"name": "Sunil Narine", "role": PlayerRole.ALL_ROUNDER, "nationality": "West Indies", "age": 34, "base_price": 1.5, "batting_style": "Right-hand", "bowling_style": "Off-break", "image_url": "https://ui-avatars.com/api/?name=Sunil+Narine&size=200"},
        {"name": "Varun Chakravarthy", "role": PlayerRole.BOWLER, "nationality": "India", "age": 28, "base_price": 1.5, "bowling_style": "Leg-break", "image_url": "https://ui-avatars.com/api/?name=Varun+Chakravarthy&size=200"},
        {"name": "Rinku Singh", "role": PlayerRole.BATSMAN, "nationality": "India", "age": 25, "base_price": 1.0, "batting_style": "Left-hand", "image_url": "https://ui-avatars.com/api/?name=Rinku+Singh&size=200"},
        {"name": "Harshit Rana", "role": PlayerRole.BOWLER, "nationality": "India", "age": 22, "base_price": 0.75, "bowling_style": "Fast", "image_url": "https://ui-avatars.com/api/?name=Harshit+Rana&size=200"},
        
        # Additional players for other teams
        {"name": "Sanju Samson", "role": PlayerRole.WICKETKEEPER, "nationality": "India", "age": 29, "base_price": 1.5, "batting_style": "Right-hand", "image_url": "https://ui-avatars.com/api/?name=Sanju+Samson&size=200"},
        {"name": "Sundar", "role": PlayerRole.BOWLER, "nationality": "India", "age": 27, "base_price": 1.0, "bowling_style": "Left-arm Orthodox", "image_url": "https://ui-avatars.com/api/?name=Washington+Sundar&size=200"},
        {"name": "Abhishek Sharma", "role": PlayerRole.BATSMAN, "nationality": "India", "age": 24, "base_price": 1.0, "batting_style": "Left-hand", "image_url": "https://ui-avatars.com/api/?name=Abhishek+Sharma&size=200"},
        {"name": "Travis Head", "role": PlayerRole.BATSMAN, "nationality": "Australia", "age": 29, "base_price": 1.5, "batting_style": "Left-hand", "image_url": "https://ui-avatars.com/api/?name=Travis+Head&size=200"},
        {"name": "Mustafizur Rahman", "role": PlayerRole.BOWLER, "nationality": "Bangladesh", "age": 28, "base_price": 1.5, "bowling_style": "Fast", "image_url": "https://ui-avatars.com/api/?name=Mustafizur+Rahman&size=200"},
    ]
    
    for player_data in players_data:
        player = db.query(Player).filter(Player.name == player_data["name"]).first()
        if not player:
            player = Player(**player_data)
            db.add(player)
    
    db.commit()
    print("✅ Players seeded")

def main():
    """Main seeding function"""
    print("\n" + "="*60)
    print("🌱 IPL AUCTION PORTAL - DATABASE SEEDING")
    print("="*60 + "\n")
    
    # Initialize database (create tables)
    print("Creating database tables...")
    init_db()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Seed teams
        print("Seeding teams...")
        seed_teams(db)
        
        # Seed players
        print("Seeding players...")
        seed_players(db)
        
        print("\n" + "="*60)
        print("✅ DATABASE SEEDING COMPLETE!")
        print("="*60)
        print("\n📊 Summary:")
        teams_count = db.query(Team).count()
        players_count = db.query(Player).count()
        print(f"  • Teams: {teams_count}")
        print(f"  • Players: {players_count}")
        print("\n🚀 Backend server is ready to use!")
        print("   API Docs: http://localhost:8000/docs\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
