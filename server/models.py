from config import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin

class Guest(db.Model, SerializerMixin):
    __tablename__ = 'guests'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200))
    id_type = db.Column(db.String(50), nullable=False)
    id_number = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    reservations = db.relationship('Reservation', backref='guest', cascade='all, delete-orphan')
    
    serialize_rules = ('-reservations.guest', '-created_at', '-updated_at')
    
    def __repr__(self):
        return f'<Guest {self.name}>'

class Room(db.Model, SerializerMixin):
    __tablename__ = 'rooms'
    
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String, unique=True, nullable=False)
    room_type = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, default='available')
    
    reservations = db.relationship('Reservation', backref='room')
    amenities = db.relationship('Amenity', secondary='room_amenities', backref='rooms')
    
    serialize_rules = ('-reservations.room', '-amenities.rooms')

class Reservation(db.Model, SerializerMixin):
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id'))
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    check_in_date = db.Column(db.DateTime, nullable=False)
    check_out_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String, default='confirmed')
    special_requests = db.Column(db.String)
    
    serialize_rules = ('-guest.reservations', '-room.reservations')

class Amenity(db.Model, SerializerMixin):
    __tablename__ = 'amenities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    
    serialize_rules = ('-rooms',)

class Staff(db.Model, SerializerMixin):
    __tablename__ = 'staff'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    position = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    serialize_rules = ('-password_hash',)

room_amenities = db.Table('room_amenities',
    db.Column('room_id', db.Integer, db.ForeignKey('rooms.id'), primary_key=True),
    db.Column('amenity_id', db.Integer, db.ForeignKey('amenities.id'), primary_key=True)
)