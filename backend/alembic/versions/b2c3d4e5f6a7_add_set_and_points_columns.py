"""add_set_and_points_columns

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-03-07 19:46:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add points, set_number, set_name columns to players."""
    op.add_column('players', sa.Column('points', sa.Integer(), server_default='0', nullable=True))
    op.add_column('players', sa.Column('set_number', sa.Integer(), server_default='1', nullable=True))
    op.add_column('players', sa.Column('set_name', sa.String(), server_default='Marquee Players', nullable=True))


def downgrade() -> None:
    """Remove points, set_number, set_name columns from players."""
    op.drop_column('players', 'set_name')
    op.drop_column('players', 'set_number')
    op.drop_column('players', 'points')
