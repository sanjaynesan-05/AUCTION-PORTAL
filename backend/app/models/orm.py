from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Text, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

Base = declarative_base()


class PlayerStatus(str, enum.Enum):
    """Player auction status"""
    PENDING = "PENDING"
    SOLD = "SOLD"


class AuctionStatus(str, enum.Enum):
    """Auction state status"""
    IDLE = "IDLE"
    LIVE = "LIVE"
    SOLD = "SOLD"


class User(Base):
    """Admin users only - simplified authentication"""
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="admin")  # Only admin role needed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<User {self.username} - {self.role}>"


class Player(Base):
    """Player model - simplified for admin-only auction"""
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String)  # Batsman, Bowler, All-rounder, Wicketkeeper
    base_price = Column(Integer)  # in lakhs
    nationality = Column(String)
    age = Column(Integer)
    batting_style = Column(String, nullable=True)
    bowling_style = Column(String, nullable=True)
    image = Column(String)
    stats = Column(JSON, nullable=True)
    
    # Auction fields - simplified
    status = Column(SQLEnum(PlayerStatus), default=PlayerStatus.PENDING, nullable=False)
    sold_price = Column(Integer, nullable=True)  # Final sold price in lakhs
    sold_to_team_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    sold_to_team = relationship("Team", back_populates="players")

    def __repr__(self):
        return f"<Player {self.name} - {self.status.value}>"


class Team(Base):
    """Team model - simplified"""
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    color = Column(String)  # Primary color for UI display
    logo = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    players = relationship("Player", back_populates="sold_to_team")

    def __repr__(self):
        return f"<Team {self.name}>"


class AuctionState(Base):
    """Singleton auction state - single source of truth"""
    __tablename__ = "auction_state"

    id = Column(Integer, primary_key=True, default=1)  # Singleton - only id=1 exists
    current_player_id = Column(Integer, ForeignKey('players.id'), nullable=True)
    status = Column(SQLEnum(AuctionStatus), default=AuctionStatus.IDLE, nullable=False)
    current_bid = Column(Integer, default=0)
    winning_team_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    last_update = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    current_player = relationship("Player", foreign_keys=[current_player_id])
    winning_team = relationship("Team", foreign_keys=[winning_team_id])

    def __repr__(self):
        return f"<AuctionState status={self.status.value} player={self.current_player_id}>"
