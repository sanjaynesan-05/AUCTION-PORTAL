from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    Numeric,
    DateTime,
    Enum,
    CheckConstraint,
    Index,
    func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.session import Base

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True)
    code = Column(String(10), unique=True, index=True) 
    logo_url = Column(String, nullable=True)
    color = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    secondary_color = Column(String, nullable=True)
    
    # Financials
    purse_balance = Column(Numeric(12, 2), default=120000000) # ₹120 Cr
    
    # Gamification
    total_points = Column(Integer, default=0)
    players_count = Column(Integer, default=0)
    
    # Relations
    players = relationship("Player", back_populates="team")
    
    # Precise Optimization & Constraints
    __table_args__ = (
        CheckConstraint("purse_balance >= 0", name="check_purse_non_negative"),
        CheckConstraint("players_count <= 25", name="check_squad_limit"),
        # Index for Lightning Fast Leaderboard
        Index("idx_team_rank", total_points.desc(), purse_balance.desc()),
    )

class Player(Base):
    __tablename__ = "players"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    role = Column(String)
    nationality = Column(String, default="India")
    age = Column(Integer, nullable=True)
    image = Column(String, nullable=True)
    points = Column(Integer, default=0)
    set_number = Column(Integer, default=1)
    set_name = Column(String, default="Marquee Players")
    base_price = Column(Numeric(12, 2), default=2000000) # Default 20L
    sold_price = Column(Numeric(12, 2), nullable=True)
    
    is_sold = Column(Boolean, default=False)
    
    # Relations (Safe Delete)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    team = relationship("Team", back_populates="players")

class Bid(Base):
    __tablename__ = "bids"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="CASCADE"))
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"))
    amount = Column(Numeric(10,2))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Optimization
    __table_args__ = (
        Index("idx_bids_player_id", "player_id"),
        Index("idx_bids_timestamp", "timestamp"),
    )

class AuctionState(Base):
    __tablename__ = "auction_state"
    
    id = Column(Integer, primary_key=True) # Always 1
    
    status = Column(String, default='WAITING') # WAITING, ACTIVE, PAUSED, COMPLETED
    current_player_id = Column(UUID(as_uuid=True), ForeignKey("players.id"), nullable=True)
    current_bid = Column(Numeric(12, 2), default=0)
    current_bidder_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)
    
    # Optimization
    remaining_players_count = Column(Integer, default=0) 
    
    # Concurrency Tracking
    version = Column(Integer, default=0) 
