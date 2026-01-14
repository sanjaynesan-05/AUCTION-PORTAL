"""
Database models for IPL Auction Portal
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from config.database import Base
from datetime import datetime
import enum

class Role(str, enum.Enum):
    ADMIN = "admin"
    PRESENTER = "presenter"

class PlayerRole(str, enum.Enum):
    BATSMAN = "Batsman"
    BOWLER = "Bowler"
    ALL_ROUNDER = "All-Rounder"
    WICKETKEEPER = "Wicketkeeper"

class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(Role), default=Role.PRESENTER, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    auction_bids = relationship("AuctionBid", back_populates="bidder")

class Team(Base):
    """Team model"""
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    short_name = Column(String(10), unique=True, nullable=False)
    logo_url = Column(String(500))
    color = Column(String(7))  # Hex color
    total_purse = Column(Float, default=1200.0)  # 120 Cr = 1200 in 10Lakhs
    remaining_purse = Column(Float, default=1200.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    players = relationship("Player", back_populates="team")
    auction_bids = relationship("AuctionBid", back_populates="team")

class Player(Base):
    """Player model"""
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(Enum(PlayerRole), nullable=False)
    nationality = Column(String(50))
    age = Column(Integer)
    base_price = Column(Float)  # in 10 Lakhs
    image_url = Column(String(500))
    batting_style = Column(String(50))
    bowling_style = Column(String(50))
    
    # Stats
    matches_played = Column(Integer, default=0)
    runs_scored = Column(Integer, default=0)
    wickets_taken = Column(Integer, default=0)
    average = Column(Float)
    strike_rate = Column(Float)
    
    # Auction info
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    sold = Column(Boolean, default=False)
    sold_price = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    team = relationship("Team", back_populates="players")
    auction_bids = relationship("AuctionBid", back_populates="player")

class AuctionBid(Base):
    """Auction bid model"""
    __tablename__ = "auction_bids"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    bidder_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bid_amount = Column(Float, nullable=False)  # in 10 Lakhs
    is_winning_bid = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    player = relationship("Player", back_populates="auction_bids")
    team = relationship("Team", back_populates="auction_bids")
    bidder = relationship("User", back_populates="auction_bids")

class AuctionStatus(Base):
    """Auction status model"""
    __tablename__ = "auction_status"
    
    id = Column(Integer, primary_key=True, index=True)
    current_player_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    is_active = Column(Boolean, default=False)
    started_at = Column(DateTime(timezone=True))
    ended_at = Column(DateTime(timezone=True), nullable=True)
    current_bid = Column(Float, nullable=True)
    current_highest_bidder_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
