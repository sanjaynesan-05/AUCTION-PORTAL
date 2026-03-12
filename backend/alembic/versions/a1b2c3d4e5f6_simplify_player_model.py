"""simplify_player_model

Revision ID: a1b2c3d4e5f6
Revises: e8247499f40c
Create Date: 2026-03-07 18:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'e8247499f40c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Drop stats, pricing, and gamification columns from players. Rename image_url to image."""
    # Drop removed columns
    op.drop_column('players', 'matches')
    op.drop_column('players', 'runs')
    op.drop_column('players', 'wickets')
    op.drop_column('players', 'average')
    op.drop_column('players', 'strike_rate')
    op.drop_column('players', 'economy')
    op.drop_column('players', 'base_price')
    op.drop_column('players', 'sold_price')
    op.drop_column('players', 'points')

    # Rename image_url -> image
    op.alter_column('players', 'image_url', new_column_name='image')


def downgrade() -> None:
    """Re-add removed columns to players."""
    # Rename back
    op.alter_column('players', 'image', new_column_name='image_url')

    # Re-add columns
    op.add_column('players', sa.Column('points', sa.Integer(), server_default='0', nullable=True))
    op.add_column('players', sa.Column('sold_price', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('players', sa.Column('base_price', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('players', sa.Column('economy', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('players', sa.Column('strike_rate', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('players', sa.Column('average', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('players', sa.Column('wickets', sa.Integer(), server_default='0', nullable=True))
    op.add_column('players', sa.Column('runs', sa.Integer(), server_default='0', nullable=True))
    op.add_column('players', sa.Column('matches', sa.Integer(), server_default='0', nullable=True))
