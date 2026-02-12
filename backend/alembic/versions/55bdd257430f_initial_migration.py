"""Initial_migration

Revision ID: 55bdd257430f
Revises: 
Create Date: 2026-02-12 20:10:21.991189

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '55bdd257430f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop all existing tables to ensure clean state
    # We use CASCADE to handle foreign keys
    op.execute("DROP TABLE IF EXISTS bid_history CASCADE")
    op.execute("DROP TABLE IF EXISTS team_players CASCADE")
    op.execute("DROP TABLE IF EXISTS auction_bids CASCADE")
    op.execute("DROP TABLE IF EXISTS users CASCADE")
    op.execute("DROP TABLE IF EXISTS auction_status CASCADE")
    op.execute("DROP TABLE IF EXISTS bids CASCADE") # If exists
    op.execute("DROP TABLE IF EXISTS auction_state CASCADE")
    op.execute("DROP TABLE IF EXISTS players CASCADE")
    op.execute("DROP TABLE IF EXISTS teams CASCADE")
    
    # Create tables fresh
    op.create_table('teams',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('code', sa.String(length=3), nullable=True),
        sa.Column('purse_balance', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('total_points', sa.Integer(), nullable=True),
        sa.Column('players_count', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('players_count <= 25', name='check_squad_limit'),
        sa.CheckConstraint('purse_balance >= 0', name='check_purse_non_negative')
    )
    op.create_index('idx_team_rank', 'teams', [sa.text('total_points DESC'), sa.text('purse_balance DESC')], unique=False)
    op.create_index(op.f('ix_teams_code'), 'teams', ['code'], unique=True)
    op.create_index(op.f('ix_teams_name'), 'teams', ['name'], unique=True)

    op.create_table('players',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('role', sa.String(), nullable=True),
        sa.Column('base_price', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('sold_price', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('is_sold', sa.Boolean(), nullable=True),
        sa.Column('points', sa.Integer(), nullable=True),
        sa.Column('team_id', sa.UUID(), nullable=True),
        sa.CheckConstraint('points >= 0', name='check_points_non_negative'),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_players_is_sold', 'players', ['is_sold'], unique=False)
    op.create_index(op.f('ix_players_name'), 'players', ['name'], unique=False)

    op.create_table('auction_state',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('current_player_id', sa.UUID(), nullable=True),
        sa.Column('current_bid', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('current_bidder_id', sa.UUID(), nullable=True),
        sa.Column('remaining_players_count', sa.Integer(), nullable=True),
        sa.Column('version', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['current_bidder_id'], ['teams.id'], ),
        sa.ForeignKeyConstraint(['current_player_id'], ['players.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('bids',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('player_id', sa.UUID(), nullable=True),
        sa.Column('team_id', sa.UUID(), nullable=True),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['player_id'], ['players.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_bids_player_id', 'bids', ['player_id'], unique=False)
    op.create_index('idx_bids_timestamp', 'bids', ['timestamp'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Since we dropped everything, downgrade would need to recreate the old schema.
    # For now we'll just drop the new tables.
    op.drop_table('bids')
    op.drop_table('auction_state')
    op.drop_table('players')
    op.drop_table('teams')
