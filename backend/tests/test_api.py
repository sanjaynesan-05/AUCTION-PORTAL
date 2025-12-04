import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
import tempfile

# Set test environment variable BEFORE importing app
os.environ["DATABASE_URL"] = "sqlite:///test.db"

from app.main import app
from app.database import get_db
from app.models.orm import Base, Player, Team, User, AuctionState, BidHistory
from app.models.seed import seed_teams, seed_players, seed_users, init_auction_state

# Use file-based SQLite for tests (more reliable than :memory:)
TEST_DATABASE_FILE = "test_auction.db"
SQLALCHEMY_TEST_DATABASE_URL = f"sqlite:///{TEST_DATABASE_FILE}"

# Create engine for tests
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables on module load
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_teardown():
    """Setup test database before each test"""
    # Clear all data before each test
    db = TestingSessionLocal()
    
    # Delete in order to avoid foreign key issues
    db.query(BidHistory).delete()
    db.query(AuctionState).delete()
    db.query(Player).delete()
    db.query(User).delete()
    db.query(Team).delete()
    db.commit()
    
    # Seed fresh data for each test
    seed_teams(db)
    seed_players(db)
    seed_users(db)
    init_auction_state(db)
    db.commit()
    db.close()
    
    yield


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# Authentication Tests
def test_login_success():
    """Test successful login"""
    response = client.post(
        "/auth/login",
        json={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "admin"
    assert data["user"]["role"] == "admin"


def test_login_invalid_credentials():
    """Test login with invalid credentials"""
    response = client.post(
        "/auth/login",
        json={"username": "admin", "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_logout():
    """Test logout endpoint"""
    response = client.post("/auth/logout")
    assert response.status_code == 200


# Player Tests
def test_get_all_players():
    """Test getting all players"""
    response = client.get("/players")
    assert response.status_code == 200
    players = response.json()
    assert isinstance(players, list)
    assert len(players) > 0


def test_get_player_by_id():
    """Test getting player by ID"""
    response = client.get("/players/1")
    assert response.status_code == 200
    player = response.json()
    assert player["id"] == 1
    assert "name" in player


def test_get_nonexistent_player():
    """Test getting non-existent player"""
    response = client.get("/players/9999")
    assert response.status_code == 404


def test_create_player():
    """Test creating a new player"""
    new_player = {
        "name": "Test Player",
        "role": "Batsman",
        "basePrice": 100,
        "nationality": "India",
        "age": 25,
        "image": "https://example.com/image.png"
    }
    response = client.post("/players", json=new_player)
    assert response.status_code == 201
    player = response.json()
    assert player["name"] == "Test Player"
    assert "id" in player


def test_update_player():
    """Test updating a player"""
    update_data = {"basePrice": 250}
    response = client.put("/players/1", json=update_data)
    assert response.status_code == 200
    player = response.json()
    assert player["basePrice"] == 250


def test_delete_player():
    """Test deleting a player"""
    response = client.delete("/players/1")
    assert response.status_code == 200
    
    # Verify deletion
    response = client.get("/players/1")
    assert response.status_code == 404


# Team Tests
def test_get_all_teams():
    """Test getting all teams"""
    response = client.get("/teams")
    assert response.status_code == 200
    teams = response.json()
    assert isinstance(teams, list)
    assert len(teams) > 0


def test_get_team_by_id():
    """Test getting team by ID"""
    response = client.get("/teams/1")
    assert response.status_code == 200
    team = response.json()
    assert team["id"] == 1
    assert "name" in team


def test_update_team_purse():
    """Test updating team purse"""
    response = client.put("/teams/1/purse", json={"purse": 15000})
    assert response.status_code == 200
    team = response.json()
    assert team["purse"] == 15000


# Auction Tests
def test_get_auction_state():
    """Test getting auction state"""
    response = client.get("/auction/state")
    assert response.status_code == 200
    state = response.json()
    assert "auctionStarted" in state
    assert "currentPlayer" in state


def test_start_auction():
    """Test starting auction"""
    response = client.post("/auction/start")
    assert response.status_code == 200
    data = response.json()
    assert data["state"]["auctionStarted"] is True
    assert data["state"]["currentPlayer"] is not None


def test_pause_resume_auction():
    """Test pausing and resuming auction"""
    # Start auction first
    client.post("/auction/start")
    
    # Pause
    response = client.post("/auction/pause")
    assert response.status_code == 200
    
    # Resume
    response = client.post("/auction/resume")
    assert response.status_code == 200


def test_place_bid():
    """Test placing a bid"""
    # Start auction
    client.post("/auction/start")
    
    # Place bid
    response = client.post(
        "/auction/bid",
        json={"teamId": 1, "amount": 200}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_place_invalid_bid():
    """Test placing invalid bid (below base price)"""
    # Start auction
    client.post("/auction/start")
    
    # Place bid below base price
    response = client.post(
        "/auction/bid",
        json={"teamId": 1, "amount": 50}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False


def test_mark_player_sold():
    """Test marking player as sold"""
    # Start auction
    client.post("/auction/start")
    
    # Mark as sold
    response = client.post(
        "/auction/mark-sold",
        json={"playerId": 1, "teamId": 1, "price": 200}
    )
    assert response.status_code == 200


def test_mark_player_unsold():
    """Test marking player as unsold"""
    # Start auction
    client.post("/auction/start")
    
    # Mark as unsold
    response = client.post(
        "/auction/mark-unsold",
        json={"playerId": 1}
    )
    assert response.status_code == 200


def test_next_player():
    """Test moving to next player"""
    # Start auction
    client.post("/auction/start")
    
    # Move to next
    response = client.post("/auction/next")
    assert response.status_code == 200


def test_previous_player():
    """Test moving to previous player"""
    # Start auction
    client.post("/auction/start")
    
    # Move to previous
    response = client.post("/auction/previous")
    assert response.status_code == 200


def test_reset_auction():
    """Test resetting auction"""
    # Start and modify auction
    client.post("/auction/start")
    client.post("/auction/bid", json={"teamId": 1, "amount": 200})
    
    # Reset
    response = client.post("/auction/reset")
    assert response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__, "-v"])


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# Authentication Tests
def test_login_success():
    """Test successful login"""
    response = client.post(
        "/auth/login",
        json={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "admin"
    assert data["user"]["role"] == "admin"


def test_login_invalid_credentials():
    """Test login with invalid credentials"""
    response = client.post(
        "/auth/login",
        json={"username": "admin", "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_logout():
    """Test logout endpoint"""
    response = client.post("/auth/logout")
    assert response.status_code == 200


# Player Tests
def test_get_all_players():
    """Test getting all players"""
    response = client.get("/players")
    assert response.status_code == 200
    players = response.json()
    assert isinstance(players, list)
    assert len(players) > 0


def test_get_player_by_id():
    """Test getting player by ID"""
    response = client.get("/players/1")
    assert response.status_code == 200
    player = response.json()
    assert player["id"] == 1
    assert "name" in player


def test_get_nonexistent_player():
    """Test getting non-existent player"""
    response = client.get("/players/9999")
    assert response.status_code == 404


def test_create_player():
    """Test creating a new player"""
    new_player = {
        "name": "Test Player",
        "role": "Batsman",
        "basePrice": 100,
        "nationality": "India",
        "age": 25,
        "image": "https://example.com/image.png"
    }
    response = client.post("/players", json=new_player)
    assert response.status_code == 201
    player = response.json()
    assert player["name"] == "Test Player"
    assert "id" in player


def test_update_player():
    """Test updating a player"""
    update_data = {"basePrice": 250}
    response = client.put("/players/1", json=update_data)
    assert response.status_code == 200
    player = response.json()
    assert player["basePrice"] == 250


def test_delete_player():
    """Test deleting a player"""
    response = client.delete("/players/1")
    assert response.status_code == 200
    
    # Verify deletion
    response = client.get("/players/1")
    assert response.status_code == 404


# Team Tests
def test_get_all_teams():
    """Test getting all teams"""
    response = client.get("/teams")
    assert response.status_code == 200
    teams = response.json()
    assert isinstance(teams, list)
    assert len(teams) > 0


def test_get_team_by_id():
    """Test getting team by ID"""
    response = client.get("/teams/1")
    assert response.status_code == 200
    team = response.json()
    assert team["id"] == 1
    assert "name" in team


def test_update_team_purse():
    """Test updating team purse"""
    response = client.put("/teams/1/purse", json={"purse": 15000})
    assert response.status_code == 200
    team = response.json()
    assert team["purse"] == 15000


# Auction Tests
def test_get_auction_state():
    """Test getting auction state"""
    response = client.get("/auction/state")
    assert response.status_code == 200
    state = response.json()
    assert "auctionStarted" in state
    assert "currentPlayer" in state


def test_start_auction():
    """Test starting auction"""
    response = client.post("/auction/start")
    assert response.status_code == 200
    data = response.json()
    assert data["state"]["auctionStarted"] is True
    assert data["state"]["currentPlayer"] is not None


def test_pause_resume_auction():
    """Test pausing and resuming auction"""
    # Start auction first
    client.post("/auction/start")
    
    # Pause
    response = client.post("/auction/pause")
    assert response.status_code == 200
    assert "message" in response.json()
    
    # Check state is paused
    response = client.get("/auction/state")
    assert response.json()["auctionPaused"] is True
    
    # Resume
    response = client.post("/auction/resume")
    assert response.status_code == 200
    
    # Check state is resumed
    response = client.get("/auction/state")
    assert response.json()["auctionPaused"] is False


def test_place_bid():
    """Test placing a bid"""
    # Start auction
    client.post("/auction/start")
    
    # Place bid
    response = client.post(
        "/auction/bid",
        json={"teamId": 1, "amount": 200}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_place_invalid_bid():
    """Test placing invalid bid (below base price)"""
    # Start auction
    client.post("/auction/start")
    
    # Place bid below base price
    response = client.post(
        "/auction/bid",
        json={"teamId": 1, "amount": 50}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False


def test_mark_player_sold():
    """Test marking player as sold"""
    # Start auction
    client.post("/auction/start")
    
    # Mark as sold
    response = client.post(
        "/auction/mark-sold",
        json={"playerId": 1, "teamId": 1, "price": 200}
    )
    assert response.status_code == 200
    assert "message" in response.json()
    
    # Verify player is sold
    response = client.get("/players/1")
    assert response.json()["sold"] is True
    assert response.json()["teamId"] == 1


def test_mark_player_unsold():
    """Test marking player as unsold"""
    # Start auction
    client.post("/auction/start")
    
    # First mark as sold
    client.post(
        "/auction/mark-sold",
        json={"playerId": 1, "teamId": 1, "price": 200}
    )
    
    # Then mark as unsold
    response = client.post(
        "/auction/mark-unsold",
        json={"playerId": 1}
    )
    assert response.status_code == 200
    assert "message" in response.json()
    
    # Verify player is unsold
    response = client.get("/players/1")
    assert response.json()["sold"] is False


def test_next_player():
    """Test moving to next player"""
    # Start auction
    client.post("/auction/start")
    
    # Get current player ID
    state1 = client.get("/auction/state").json()
    player1_id = state1["currentPlayer"]["id"]
    
    # Move to next
    response = client.post("/auction/next")
    assert response.status_code == 200
    
    # Verify player changed
    state2 = client.get("/auction/state").json()
    if state2["currentPlayer"]:
        assert state2["currentPlayer"]["id"] != player1_id


def test_reset_auction():
    """Test resetting auction"""
    # Start and modify auction
    client.post("/auction/start")
    client.post("/auction/bid", json={"teamId": 1, "amount": 200})
    
    # Reset
    response = client.post("/auction/reset")
    assert response.status_code == 200
    
    # Verify reset
    state = client.get("/auction/state").json()
    assert state["auctionStarted"] is False
    assert state["currentBid"] == 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
