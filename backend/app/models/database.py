from typing import Dict, List, Optional
from app.schemas import Player, Team, UserResponse
import time

# In-memory storage
players_db: Dict[int, Player] = {}
teams_db: Dict[int, Team] = {}
users_db: Dict[str, dict] = {}

# Auction state
auction_state = {
    "currentIndex": 0,
    "currentPlayer": None,
    "auctionStarted": False,
    "auctionPaused": False,
    "currentBid": 0,
    "currentBidder": None,
    "bidHistory": [],
    "lastBid": None,
    "lastUpdate": int(time.time() * 1000)
}


def init_mock_data():
    """Initialize mock data matching the frontend"""
    global players_db, teams_db, users_db
    
    # Mock Teams
    mock_teams = [
        {"id": 1, "name": "Chennai Super Kings", "shortName": "CSK", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png", "players": [], "color": "#FFCC00", "primaryColor": "#FFCC00", "secondaryColor": "#003366"},
        {"id": 2, "name": "Mumbai Indians", "shortName": "MI", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png", "players": [], "color": "#004BA0", "primaryColor": "#004BA0", "secondaryColor": "#FFD700"},
        {"id": 3, "name": "Royal Challengers Bangalore", "shortName": "RCB", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png", "players": [], "color": "#EC1C24", "primaryColor": "#EC1C24", "secondaryColor": "#FFD700"},
        {"id": 4, "name": "Kolkata Knight Riders", "shortName": "KKR", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png", "players": [], "color": "#3A225D", "primaryColor": "#3A225D", "secondaryColor": "#FFD700"},
        {"id": 5, "name": "Delhi Capitals", "shortName": "DC", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png", "players": [], "color": "#004C93", "primaryColor": "#004C93", "secondaryColor": "#DC143C"},
        {"id": 6, "name": "Rajasthan Royals", "shortName": "RR", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png", "players": [], "color": "#254AA5", "primaryColor": "#254AA5", "secondaryColor": "#FFB6C1"},
        {"id": 7, "name": "Punjab Kings", "shortName": "PBKS", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png", "players": [], "color": "#ED1B24", "primaryColor": "#ED1B24", "secondaryColor": "#FFD700"},
        {"id": 8, "name": "Sunrisers Hyderabad", "shortName": "SRH", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png", "players": [], "color": "#FF822A", "primaryColor": "#FF822A", "secondaryColor": "#000000"},
        {"id": 9, "name": "Gujarat Titans", "shortName": "GT", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png", "players": [], "color": "#1B2631", "primaryColor": "#1B2631", "secondaryColor": "#FFD700"},
        {"id": 10, "name": "Lucknow Super Giants", "shortName": "LSG", "purse": 12000, "logo": "https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png", "players": [], "color": "#00A0E3", "primaryColor": "#00A0E3", "secondaryColor": "#FFD700"}
    ]
    
    for team_data in mock_teams:
        team = Team(**team_data)
        teams_db[team.id] = team
    
    # Mock Players (subset for brevity)
    mock_players = [
        {"id": 1, "name": "Virat Kohli", "role": "Batsman", "basePrice": 200, "sold": False, "nationality": "India", "age": 35, "battingStyle": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1.png", "stats": {"matches": 223, "runs": 7263, "average": 37.25, "strikeRate": 131.97}},
        {"id": 2, "name": "Jasprit Bumrah", "role": "Bowler", "basePrice": 150, "sold": False, "nationality": "India", "age": 30, "bowlingStyle": "Right-arm fast", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/8.png", "stats": {"matches": 120, "wickets": 165, "average": 24.43, "strikeRate": 19.17}},
        {"id": 3, "name": "MS Dhoni", "role": "Wicketkeeper", "basePrice": 180, "sold": False, "nationality": "India", "age": 42, "battingStyle": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/28.png", "stats": {"matches": 250, "runs": 5243, "average": 39.13, "strikeRate": 135.92}},
        {"id": 4, "name": "Rohit Sharma", "role": "Batsman", "basePrice": 190, "sold": False, "nationality": "India", "age": 36, "battingStyle": "Right-handed", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png", "stats": {"matches": 243, "runs": 6628, "average": 31.17, "strikeRate": 130.39}},
        {"id": 5, "name": "Rashid Khan", "role": "Bowler", "basePrice": 140, "sold": False, "nationality": "Afghanistan", "age": 25, "bowlingStyle": "Right-arm leg-spin", "image": "https://documents.iplt20.com/ipl/IPLHeadshot2024/109.png", "stats": {"matches": 76, "wickets": 93, "average": 24.34, "strikeRate": 18.94}}
    ]
    
    for player_data in mock_players:
        player = Player(**player_data)
        players_db[player.id] = player
    
    # Mock Users - clear and repopulate
    users_db.clear()
    users_db.update({
        "admin": {"id": "admin", "username": "admin", "password": "admin123", "role": "admin"},
        "presenter": {"id": "presenter", "username": "presenter", "password": "presenter123", "role": "presenter"},
        "csk_viewer": {"id": "viewer-csk", "username": "csk_viewer", "password": "csk@2024", "role": "viewer", "teamId": 1, "teamName": "Chennai Super Kings"},
        "mi_viewer": {"id": "viewer-mi", "username": "mi_viewer", "password": "mi@2024", "role": "viewer", "teamId": 2, "teamName": "Mumbai Indians"},
        "rcb_viewer": {"id": "viewer-rcb", "username": "rcb_viewer", "password": "rcb@2024", "role": "viewer", "teamId": 3, "teamName": "Royal Challengers Bangalore"}
    })


def get_unsold_players() -> List[Player]:
    """Get list of unsold players"""
    return [p for p in players_db.values() if not p.sold]


def reset_auction():
    """Reset auction to initial state"""
    global auction_state
    
    # Reset all players
    for player in players_db.values():
        player.sold = False
        player.teamId = None
        player.price = None
    
    # Reset all teams
    for team in teams_db.values():
        team.purse = 12000
        team.players = []
    
    # Reset auction state
    unsold = get_unsold_players()
    auction_state["currentIndex"] = 0
    auction_state["currentPlayer"] = unsold[0].model_dump() if unsold else None
    auction_state["auctionStarted"] = False
    auction_state["auctionPaused"] = False
    auction_state["currentBid"] = 0
    auction_state["currentBidder"] = None
    auction_state["bidHistory"] = []
    auction_state["lastBid"] = None
    auction_state["lastUpdate"] = int(time.time() * 1000)
