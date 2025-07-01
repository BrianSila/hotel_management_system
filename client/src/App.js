import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import GuestList from './components/GuestList';
import RoomList from './components/RoomList';
import ReservationList from './components/ReservationList';
import NewReservation from './components/NewReservation';
import StaffLogin from './components/StaffLogin';
import RoomCalendar from './components/RoomCalendar';
import AdminDashboard from './components/AdminDashboard';
import AddGuestForm from './components/AddGuestForm'; 
import SignUp from './components/SignUp';
import './App.css';

function App() {
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const storedStaff = localStorage.getItem('staff');
    if (storedStaff) {
      setStaff(JSON.parse(storedStaff));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('staff');
    setStaff(null);
    fetch('/staff/logout', {
      method: 'DELETE',
      credentials: 'include'
    });
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/guests">Guests</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/reservations/new">New Reservation</Link>
          <Link to="/guests/new">Add Guest</Link> {/* New link */}
          <Link to="/calendar">Availability Calendar</Link>
          {staff ? (
            <>
              <Link to="/admin">Admin</Link>
              <button onClick={handleLogout}>Logout</button>
              <span>Welcome, {staff.name}</span>
            </>
          ) : (
            <Link to="/staff/login">Staff Login</Link>
          )}
        </nav>
        
        <Routes>
          <Route path="/" element={<Navigate to="/rooms" />} />
          <Route path="/guests" element={<GuestList />} />
          <Route path="/guests/new" element={<AddGuestForm />} /> {/* New route */}
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/reservations/new" element={<NewReservation />} />
          <Route path="/calendar" element={<RoomCalendar />} />
          <Route path="/staff/login" element={<StaffLogin setStaff={setStaff} />} />
          <Route path="/staff/signup" element={<SignUp />} />
          <Route 
            path="/admin" 
            element={staff ? <AdminDashboard /> : <Navigate to="/staff/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;