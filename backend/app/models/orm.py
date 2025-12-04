from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Text, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import json

Base = declarative_base()

# Association table for Team-Player many-to-many relationship
team_players = Table(
    'team_players',
    Base.metadata,
    Column('team_id', Integer, ForeignKey('teams.id'), primary_key=True),
    Column('player_id', Integer, ForeignKey('players.id'), primary_key=True)
)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # admin, presenter, viewer
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    team_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="users")

    def __repr__(self):
        return f"<User {self.username} - {self.role}>"


class Player(Base):
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
    stats = Column(JSON, nullable=True)  # matches, runs, wickets, average, strikeRate
    
    # Auction fields
    sold = Column(Boolean, default=False)
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    price = Column(Integer, nullable=True)  # Sold price in lakhs
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="players")
    bids = relationship("BidHistory", back_populates="player", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Player {self.name}>"


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    short_name = Column(String, unique=True)
    initial_purse = Column(Integer, default=12000)  # in lakhs
    remaining_purse = Column(Integer, default=12000)  # in lakhs
    logo = Column(String)
    color = Column(String)
    primary_color = Column(String)
    secondary_color = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    players = relationship("Player", back_populates="team")
    users = relationship("User", back_populates="team")
    bids = relationship("BidHistory", back_populates="team")

    def __repr__(self):
        return f"<Team {self.name}>"


class AuctionState(Base):
    __tablename__ = "auction_state"

    id = Column(Integer, primary_key=True, index=True)
    current_index = Column(Integer, default=0)
    current_player_id = Column(Integer, ForeignKey('players.id'), nullable=True)
    auction_started = Column(Boolean, default=False)
    auction_paused = Column(Boolean, default=False)
    current_bid = Column(Integer, default=0)
    current_bidder_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    last_update = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    current_player = relationship("Player")
    current_bidder = relationship("Team")

    def __repr__(self):
        return f"<AuctionState started={self.auction_started}>"


class BidHistory(Base):
    __tablename__ = "bid_history"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey('players.id'), index=True)
    team_id = Column(Integer, ForeignKey('teams.id'), index=True)
    amount = Column(Integer)  # in lakhs
    bid_time = Column(DateTime, default=datetime.utcnow)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    player = relationship("Player", back_populates="bids")
    team = relationship("Team", back_populates="bids")

    def __repr__(self):
        return f"<BidHistory player={self.player_id} team={self.team_id} amount={self.amount}>"
