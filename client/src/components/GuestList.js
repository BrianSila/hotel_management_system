import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddGuestForm from './AddGuestForm'; 
import './GuestList.css';

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/guests');
      if (!response.ok) throw new Error('Failed to fetch guests');
      const data = await response.json();
      setGuests(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGuestAdded = (guest) => {
    setGuests([...guests, guest]);
    setNewGuest(guest);
    setShowAddForm(false);
    setTimeout(() => setNewGuest(null), 3000);
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading guests...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="guest-list-container">
      <div className="guest-list-header">
        <h2>Guest List</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search guests..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="button-group">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="add-guest-btn"
            >
              {showAddForm ? 'Cancel' : '+ Add Guest'}
            </button>
            <Link to="/reservations/new" className="new-reservation-btn">
              + New Reservation
            </Link>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="add-guest-form-container">
          <AddGuestForm onGuestAdded={handleGuestAdded} />
        </div>
      )}

      {newGuest && (
        <div className="success-message">
          Successfully added guest: {newGuest.name}
        </div>
      )}

      <div className="guest-table-container">
        <table className="guest-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map(guest => (
                <tr key={guest.id}>
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>{guest.phone}</td>
                  <td>
                    <Link 
                      to={`/reservations/new?guestId=${guest.id}`} 
                      className="action-btn"
                    >
                      New Booking
                    </Link>
                    <Link 
                      to={`/guests/${guest.id}`} 
                      className="view-btn"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">
                  No guests found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestList;