# Hotel Management System

A full-stack web application for managing hotel operations including guest reservations, room management, and staff administration.

![System Overview](https://i.imgur.com/JKvQ8hS.png) 

## Features

- **Guest Management**: Create, view, update, and delete guest records
- **Room Management**: Manage room inventory, types, and amenities
- **Reservation System**: Handle bookings, check-ins, and check-outs
- **Staff Portal**: Admin and receptionist interfaces with different permissions
- **Reporting**: View room availability and occupancy reports

## Technologies

### Backend
- Python 3.8+
- Flask
- Flask-RESTful
- SQLAlchemy (ORM)
- SQLite (Development) / PostgreSQL (Production)

### Frontend
- React.js
- Formik (Form management)
- Yup (Validation)
- React Router
- Axios (HTTP client)

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/BrianSila/hotel_management_system
   cd hotel-management-system/server
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```bash
   python seed.py
   ```

5. Run the server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
