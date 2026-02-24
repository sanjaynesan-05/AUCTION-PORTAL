from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.auction_service import place_bid, confirm_sale, reset_auction_logic, get_auction_state
from app.schemas.schemas import BidRequest, AuctionStateResponse
from app.models.all_models import AuctionState, Player, Bid, Team
from sqlalchemy import select, update
from app.websockets.manager import manager
from uuid import UUID

router = APIRouter()

@router.get("/state", response_model=AuctionStateResponse)
async def get_state(db: AsyncSession = Depends(get_db)):
    state = await get_auction_state(db)
    return state

@router.post("/bid")
async def bid(bid_request: BidRequest, db: AsyncSession = Depends(get_db)):
    try:
        state = await place_bid(amount=bid_request.amount, team_id=bid_request.team_id, session=db)
        return {"status": "success", "current_bid": state.current_bid}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/confirm-sale")
async def confirm(db: AsyncSession = Depends(get_db)):
    try:
        await confirm_sale(db)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reset")
async def reset(db: AsyncSession = Depends(get_db)):
    await reset_auction_logic(db)
    return {"status": "reset_complete"}

@router.post("/select-player/{player_id}")
async def select_player(player_id: UUID, db: AsyncSession = Depends(get_db)):
    # Simple logic to select a player for auction
    async with db.begin():
        result = await db.execute(select(AuctionState).where(AuctionState.id == 1).with_for_update())
        state = result.scalar_one()
        
        if state.status == "ACTIVE" and state.current_bidder_id:
            raise HTTPException(status_code=400, detail="Cannot switch player while bid is active")
            
        player = await db.get(Player, player_id)
        if not player:
            raise HTTPException(status_code=404, detail="Player not found")
        if player.is_sold:
            raise HTTPException(status_code=400, detail="Player already sold")
            
        state.current_player_id = player_id
        state.status = "ACTIVE"
        state.current_bid = player.base_price
        state.current_bidder_id = None
        
    await manager.broadcast("PLAYER_SELECTED", {"player_id": str(player_id)})

@router.get("/all-bids")
async def get_all_bids(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Bid, Player.name, Team.code)
        .join(Player, Bid.player_id == Player.id)
        .join(Team, Bid.team_id == Team.id)
        .order_by(Bid.timestamp.desc())
    )
    bids = []
    for row in result.all():
        bid, player_name, team_code = row
        bids.append({
            "id": str(bid.id),
            "player_name": player_name,
            "team_code": team_code,
            "amount": float(bid.amount) / 100000,
            "timestamp": bid.timestamp.isoformat()
        })
    return bids
