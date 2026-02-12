from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes import auction, teams, players
from app.websockets.manager import manager
from app.db.session import engine, Base, async_session_maker
from app.models.all_models import AuctionState, Player
from sqlalchemy import select, func

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables & Self-heal state
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    print("Startup: Tables verified.")
    
    # Self-healing: Sync remaining players count
    async with async_session_maker() as session:
        async with session.begin():
            # Calculate actual unsold players
            count = await session.scalar(select(func.count(Player.id)).where(Player.is_sold == False))
            
            # Update Auction State
            result = await session.execute(select(AuctionState).where(AuctionState.id == 1))
            state = result.scalar_one_or_none()
            
            if state:
                if state.remaining_players_count != count:
                    state.remaining_players_count = count
                    print(f"Self-healing: Synced remaining players count to {count}")
            else:
                # Initialize if missing
                state = AuctionState(id=1, status="WAITING", remaining_players_count=count)
                session.add(state)
                print(f"Self-healing: Initialized Auction State with count {count}")
    
    print("Startup: State Synced. Application Ready.")
    
    yield
    
    # Shutdown: Clean up resources if needed
    print("Shutdown: Application stopping.")

app = FastAPI(
    title="IPL Auction Portal", 
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for now, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auction.router, prefix="/api/auction", tags=["Auction"])
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(players.router, prefix="/api/players", tags=["Players"])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if any (e.g. ping)
            pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"message": "IPL Auction Portal Backend is Running"}
