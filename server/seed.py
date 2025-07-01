from config import app, db
from models import Guest, Room, Reservation, Amenity, Staff
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
from sqlalchemy import text  # Add this import

def seed_data():
    with app.app_context():
        print("Deleting all records...")
        # Clear all data in proper order to avoid foreign key conflicts
        db.session.query(Reservation).delete()
        db.session.query(Guest).delete()
        db.session.query(Staff).delete()
        
        # Clear the room_amenities association table with proper text() wrapper
        db.session.execute(text('DELETE FROM room_amenities'))
        
        db.session.query(Room).delete()
        db.session.query(Amenity).delete()
        db.session.commit()

        print("Creating initial admin...")
        if not Staff.query.filter_by(email='admin@hotel.com').first():
            admin = Staff(
                name="Admin User",
                position="Manager",
                email="admin@hotel.com",
                password_hash=generate_password_hash("admin123"),
                is_admin=True
            )
            db.session.add(admin)
            print("Admin created: admin@hotel.com / admin123")
        else:
            print("Admin already exists")

        print("Creating other staff members...")
        staff = [
            Staff(
                name="Reception Staff",
                position="Receptionist",
                email="reception@hotel.com",
                password_hash=generate_password_hash("reception123"),
                is_admin=False
            )
        ]
        db.session.add_all(staff)

        print("Creating amenities...")
        amenities = [
            Amenity(name="WiFi", description="High-speed internet access"),
            Amenity(name="Pool", description="Outdoor swimming pool"),
            Amenity(name="Gym", description="24-hour fitness center"),
            Amenity(name="Spa", description="Full-service spa"),
            Amenity(name="Breakfast", description="Complimentary breakfast")
        ]
        db.session.add_all(amenities)
        db.session.commit()  # Commit to get amenity IDs

        print("Creating rooms...")
        rooms = [
            Room(room_number="101", room_type="Standard", price=99.99, capacity=2, status="available"),
            Room(room_number="102", room_type="Standard", price=99.99, capacity=2, status="available"),
            Room(room_number="201", room_type="Deluxe", price=149.99, capacity=3, status="available"),
            Room(room_number="202", room_type="Deluxe", price=149.99, capacity=3, status="available"),
            Room(room_number="301", room_type="Suite", price=249.99, capacity=4, status="available"),
            Room(room_number="302", room_type="Suite", price=249.99, capacity=4, status="maintenance")
        ]
        db.session.add_all(rooms)
        db.session.commit()  # Commit to get room IDs

        print("Assigning amenities to rooms...")
        # Get fresh references after commit
        rooms = Room.query.order_by(Room.id).all()
        amenities = Amenity.query.order_by(Amenity.id).all()
        
        # Clear any existing relationships (just in case)
        for room in rooms:
            room.amenities = []
        
        # Assign amenities carefully without duplicates
        rooms[0].amenities = [amenities[0], amenities[4]]
        rooms[1].amenities = [amenities[0], amenities[4]]
        rooms[2].amenities = [amenities[0], amenities[1], amenities[4]]
        rooms[3].amenities = [amenities[0], amenities[1], amenities[4]]
        rooms[4].amenities = amenities[:]  # All amenities
        rooms[5].amenities = amenities[:]  # All amenities
        
        db.session.commit()

        print("Creating guests...")
        guests = [
            Guest(
                name="John Doe", 
                email="john@example.com", 
                phone="555-0101",
                id_type="Passport",
                id_number="A12345678"
            ),
            Guest(
                name="Jane Smith", 
                email="jane@example.com", 
                phone="555-0102",
                id_type="Driver's License",
                id_number="DL987654"
            ),
            Guest(
                name="Robert Johnson", 
                email="robert@example.com", 
                phone="555-0103",
                id_type="Passport",
                id_number="B87654321"
            ),
            Guest(
                name="Emily Davis", 
                email="emily@example.com", 
                phone="555-0104",
                id_type="National ID",
                id_number="ID123456"
            ),
            Guest(
                name="Michael Brown", 
                email="michael@example.com", 
                phone="555-0105",
                id_type="Passport",
                id_number="C65432198"
            )
        ]
        db.session.add_all(guests)
        db.session.commit()

        print("Creating reservations...")
        today = datetime.now().date()
        reservations = [
            Reservation(
                guest_id=1,
                room_id=1,
                check_in_date=today - timedelta(days=2),
                check_out_date=today + timedelta(days=1),
                status="checked-in",
                special_requests="Early check-in requested"
            ),
            Reservation(
                guest_id=2,
                room_id=3,
                check_in_date=today + timedelta(days=3),
                check_out_date=today + timedelta(days=5),
                status="confirmed",
                special_requests="High floor preferred"
            ),
            Reservation(
                guest_id=3,
                room_id=4,
                check_in_date=today + timedelta(days=7),
                check_out_date=today + timedelta(days=10),
                status="confirmed",
                special_requests="Anniversary celebration"
            )
        ]
        db.session.add_all(reservations)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()