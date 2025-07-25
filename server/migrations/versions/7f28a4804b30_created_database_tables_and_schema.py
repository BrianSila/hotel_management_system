"""Created database tables and schema

Revision ID: 7f28a4804b30
Revises: 
Create Date: 2025-07-01 18:28:12.905912

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7f28a4804b30'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('amenities',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('guests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=True),
    sa.Column('id_type', sa.String(length=50), nullable=False),
    sa.Column('id_number', sa.String(length=50), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('rooms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('room_number', sa.String(), nullable=False),
    sa.Column('room_type', sa.String(), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('capacity', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('room_number')
    )
    op.create_table('staff',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('position', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('reservations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('guest_id', sa.Integer(), nullable=True),
    sa.Column('room_id', sa.Integer(), nullable=True),
    sa.Column('check_in_date', sa.DateTime(), nullable=False),
    sa.Column('check_out_date', sa.DateTime(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('special_requests', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['guest_id'], ['guests.id'], name=op.f('fk_reservations_guest_id_guests')),
    sa.ForeignKeyConstraint(['room_id'], ['rooms.id'], name=op.f('fk_reservations_room_id_rooms')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('room_amenities',
    sa.Column('room_id', sa.Integer(), nullable=False),
    sa.Column('amenity_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['amenity_id'], ['amenities.id'], name=op.f('fk_room_amenities_amenity_id_amenities')),
    sa.ForeignKeyConstraint(['room_id'], ['rooms.id'], name=op.f('fk_room_amenities_room_id_rooms')),
    sa.PrimaryKeyConstraint('room_id', 'amenity_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('room_amenities')
    op.drop_table('reservations')
    op.drop_table('staff')
    op.drop_table('rooms')
    op.drop_table('guests')
    op.drop_table('amenities')
    # ### end Alembic commands ###
