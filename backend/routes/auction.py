"""
Auction API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.models import AuctionStatus, AuctionBid, Player, Team
from datetime import datetime

router = APIRouter()

@router.get("/status")
async def get_auction_status(db: Session = Depends(get_db)):
    """Get current auction status"""
    auction = db.query(AuctionStatus).first()
    if not auction:
        return {
            "isActive": False,
            "currentPlayer": None,
            "currentBid": 0,
            "currentBiddingTeam": None
        }
    
    current_player = None
    if auction.current_player_id:
        player = db.query(Player).filter(Player.id == auction.current_player_id).first()
        if player:
            current_player = {
                "id": player.id,
                "name": player.name,
                "role": player.role,
                "image": player.image_url,
                "basePrice": (player.base_price or 0) * 100
            }
    
    current_bidding_team = None
    if auction.current_highest_bidder_id:
        team = db.query(Team).filter(Team.id == auction.current_highest_bidder_id).first()
        if team:
            current_bidding_team = {
                "id": team.id,
                "name": team.name,
                "shortName": team.short_name,
                "logo": team.logo_url
            }
    
    return {
        "isActive": auction.is_active,
        "currentPlayer": current_player,
        "currentBid": (auction.current_bid or 0) * 100,
        "currentBiddingTeam": current_bidding_team
    }

@router.post("/start")
async def start_auction(db: Session = Depends(get_db)):
    """Start auction"""
    auction = db.query(AuctionStatus).first()
    if not auction:
        auction = AuctionStatus(is_active=True, started_at=datetime.utcnow())
        db.add(auction)
    else:
        auction.is_active = True
        auction.started_at = datetime.utcnow()
    
    db.commit()
    return {"success": True, "message": "Auction started"}

@router.post("/end")
async def end_auction(db: Session = Depends(get_db)):
    """End auction"""
    auction = db.query(AuctionStatus).first()
    if auction:
        auction.is_active = False
        auction.ended_at = datetime.utcnow()
        db.commit()
    
    return {"success": True, "message": "Auction ended"}

@router.post("/bid")
async def place_bid(
    player_id: int,
    team_id: int,
    bid_amount: float,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Place bid on a player"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Create bid record
    bid = AuctionBid(
        player_id=player_id,
        team_id=team_id,
        bidder_id=user_id,
        bid_amount=bid_amount / 100  # Convert from Crores
    )
    db.add(bid)
    
    # Update auction status
    auction = db.query(AuctionStatus).first()
    if auction:
        auction.current_player_id = player_id
        auction.current_bid = bid_amount / 100
        auction.current_highest_bidder_id = team_id
    
    db.commit()
    
    return {
        "success": True,
        "bidId": bid.id,
        "playerName": player.name,
        "teamName": team.name,
        "bidAmount": bid_amount
    }

@router.post("/sold")
async def mark_sold(player_id: int, team_id: int, price: float, db: Session = Depends(get_db)):
    """Mark player as sold"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Update player
    player.sold = True
    player.sold_price = price / 100
    player.team_id = team_id
    
    # Update team purse
    team.remaining_purse -= price / 100
    
    # Update auction status
    auction = db.query(AuctionStatus).first()
    if auction:
        auction.current_bid = AuctionBid.bid_amount
        auction.current_highest_bidder_id = None
    
    db.commit()
    
    return {
        "success": True,
        "playerName": player.name,
        "teamName": team.name,
        "soldPrice": price
    }

@router.post("/unsold")
async def mark_unsold(player_id: int, db: Session = Depends(get_db)):
    """Mark player as unsold"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Return purse to team if it was sold before
    if player.sold and player.team_id:
        team = db.query(Team).filter(Team.id == player.team_id).first()
        if team:
            team.remaining_purse += player.sold_price or 0
    
    player.sold = False
    player.sold_price = None
    player.team_id = None
    
    db.commit()
    
    return {
        "success": True,
        "playerName": player.name,
        "status": "unsold"
    }
