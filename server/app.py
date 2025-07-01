from flask import Flask, jsonify, request, make_response, session
from flask_restful import Resource, Api
from config import app, db, api
from models import Guest, Room, Reservation, Amenity, Staff
from werkzeug.security import check_password_hash
from datetime import datetime
from flask_session import Session
import os

@app.route('/')
def home():
    return '<h1>Hotel Management System API</h1>'

class Guests(Resource):
    def get(self):
        guests = [guest.to_dict() for guest in Guest.query.all()]
        return guests, 200
    
    def post(self):
        data = request.get_json()
        
        required_fields = ['name', 'email', 'phone', 'idType', 'idNumber']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return {'error': f'Missing required fields: {", ".join(missing_fields)}'}, 400
        
        if Guest.query.filter_by(email=data['email']).first():
            return {'error': 'Email already exists'}, 400
        
        try:
            guest = Guest(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                address=data.get('address'),
                id_type=data['idType'],  
                id_number=data['idNumber']  
            )
            
            db.session.add(guest)
            db.session.commit()
            return guest.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400 

class GuestById(Resource):
    def get(self, id):
        guest = Guest.query.get(id)
        if not guest:
            return make_response({'error': 'Guest not found'}, 404)
        return make_response(jsonify(guest.to_dict())), 200
    
    def patch(self, id):
        guest = Guest.query.get(id)
        if not guest:
            return make_response({'error': 'Guest not found'}, 404)
        
        data = request.get_json()
        try:
            for attr in data:
                setattr(guest, attr, data[attr])
            db.session.commit()
            return make_response(jsonify(guest.to_dict()), 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    
    def delete(self, id):
        guest = Guest.query.get(id)
        if not guest:
            return make_response({'error': 'Guest not found'}, 404)
        
        db.session.delete(guest)
        db.session.commit()
        return make_response({}, 204)

class Rooms(Resource):
    def get(self):
        rooms = [room.to_dict() for room in Room.query.all()]
        return make_response(jsonify(rooms), 200)
    
    def post(self):
        data = request.get_json()
        try:
            room = Room(
                room_number=data['room_number'],
                room_type=data['room_type'],
                price=data['price'],
                capacity=data['capacity'],
                status=data.get('status', 'available')
            )
            db.session.add(room)
            db.session.commit()
            return make_response(jsonify(room.to_dict()), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 400)

class RoomById(Resource):
    def get(self, id):
        room = Room.query.get(id)
        if not room:
            return make_response({'error': 'Room not found'}, 404)
        return make_response(jsonify(room.to_dict()), 200)
    
    def patch(self, id):
        room = Room.query.get(id)
        if not room:
            return make_response({'error': 'Room not found'}, 404)
        
        data = request.get_json()
        try:
            for attr in data:
                setattr(room, attr, data[attr])
            db.session.commit()
            return make_response(jsonify(room.to_dict()), 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    
    def delete(self, id):
        room = Room.query.get(id)
        if not room:
            return make_response({'error': 'Room not found'}, 404)
        
        db.session.delete(room)
        db.session.commit()
        return make_response({}, 204)

class Reservations(Resource):
    def get(self):
        reservations = [res.to_dict() for res in Reservation.query.all()]
        return make_response(jsonify(reservations), 200)
    
    def post(self):
        data = request.get_json()
        try:
            reservation = Reservation(
                guest_id=data['guest_id'],
                room_id=data['room_id'],
                check_in_date=datetime.fromisoformat(data['check_in_date']),
                check_out_date=datetime.fromisoformat(data['check_out_date']),
                status=data.get('status', 'confirmed'),
                special_requests=data.get('special_requests')
            )
            db.session.add(reservation)
            db.session.commit()
            return make_response(jsonify(reservation.to_dict()), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 400)

class ReservationById(Resource):
    def get(self, id):
        reservation = Reservation.query.get(id)
        if not reservation:
            return make_response({'error': 'Reservation not found'}, 404)
        return make_response(jsonify(reservation.to_dict()), 200)
    
    def patch(self, id):
        reservation = Reservation.query.get(id)
        if not reservation:
            return make_response({'error': 'Reservation not found'}, 404)
        
        data = request.get_json()
        try:
            for attr in data:
                if attr in ['check_in_date', 'check_out_date']:
                    setattr(reservation, attr, datetime.fromisoformat(data[attr]))
                else:
                    setattr(reservation, attr, data[attr])
            db.session.commit()
            return make_response(jsonify(reservation.to_dict()), 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    
    def delete(self, id):
        reservation = Reservation.query.get(id)
        if not reservation:
            return make_response({'error': 'Reservation not found'}, 404)
        
        db.session.delete(reservation)
        db.session.commit()
        return make_response({}, 204)

class Amenities(Resource):
    def get(self):
        amenities = [amenity.to_dict() for amenity in Amenity.query.all()]
        return make_response(jsonify(amenities), 200)
    
    def post(self):
        data = request.get_json()
        try:
            amenity = Amenity(
                name=data['name'],
                description=data.get('description')
            )
            db.session.add(amenity)
            db.session.commit()
            return make_response(jsonify(amenity.to_dict()), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 400)

class StaffLogin(Resource):
    def post(self):
        data = request.get_json()
        staff = Staff.query.filter_by(email=data['email']).first()
        
        if staff and staff.check_password(data['password']):
            session['staff_id'] = staff.id
            return make_response(jsonify(staff.to_dict()), 200)
        return make_response({'error': 'Invalid email or password'}, 401)
    
class StaffSignup(Resource):
    def post(self):
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'position']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return {'error': f'Missing required fields: {", ".join(missing_fields)}'}, 400
        
        # Validate email format
        if '@' not in data['email'] or '.' not in data['email'].split('@')[1]:
            return {'error': 'Invalid email format'}, 400
        
        # Validate password strength
        if len(data['password']) < 8:
            return {'error': 'Password must be at least 8 characters'}, 400
        
        try:
            # Check if email exists
            if Staff.query.filter_by(email=data['email']).first():
                return {'error': 'Email already registered'}, 409
            
            # Create new staff
            staff = Staff(
                name=data['name'],
                email=data['email'],
                position=data['position']
            )
            staff.set_password(data['password'])
            
            db.session.add(staff)
            db.session.commit()
            
            # Return success without password hash
            return {
                'id': staff.id,
                'name': staff.name,
                'email': staff.email,
                'position': staff.position
            }, 201
            
        except Exception as e:
            db.session.rollback()
            app.logger.error(f'Staff signup error: {str(e)}')
            return {'error': 'Registration failed'}, 500

class StaffLogout(Resource):
    def delete(self):
        session.pop('staff_id', None)
        return make_response({}, 204)

class CheckAuth(Resource):
    def get(self):
        staff_id = session.get('staff_id')
        if staff_id:
            staff = Staff.query.get(staff_id)
            if staff:
                return make_response(jsonify(staff.to_dict()), 200)
        return make_response({'error': 'Unauthorized'}, 401)

class RoomAvailability(Resource):
    def get(self):
        date_str = request.args.get('date')
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.now().date()
        except ValueError:
            return make_response({'error': 'Invalid date format. Use YYYY-MM-DD'}, 400)
        
        rooms = Room.query.all()
        availability = []
        
        for room in rooms:
            conflicting_reservations = Reservation.query.filter(
                Reservation.room_id == room.id,
                Reservation.check_in_date <= date,
                Reservation.check_out_date > date,
                Reservation.status.in_(['confirmed', 'checked-in'])
            ).count()
            
            availability.append({
                'room_id': room.id,
                'room_number': room.room_number,
                'room_type': room.room_type,
                'available': conflicting_reservations == 0 and room.status == 'available',
                'status': room.status
            })
        
        return make_response(jsonify(availability), 200)

api.add_resource(Guests, '/guests')
api.add_resource(GuestById, '/guests/<int:id>')
api.add_resource(Rooms, '/rooms')
api.add_resource(RoomById, '/rooms/<int:id>')
api.add_resource(Reservations, '/reservations')
api.add_resource(ReservationById, '/reservations/<int:id>')
api.add_resource(Amenities, '/amenities')
api.add_resource(StaffLogin, '/staff/login')
api.add_resource(StaffSignup, '/staff/signup')
api.add_resource(StaffLogout, '/staff/logout')
api.add_resource(CheckAuth, '/staff/check-auth')
api.add_resource(RoomAvailability, '/rooms/availability')

if __name__ == '__main__':
    app.run(port=5555, debug=True)