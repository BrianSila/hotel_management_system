import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/reservations')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch reservations');
        }
        return res.json();
      })
      .then(data => {
        setReservations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true;
    return res.status === filter;
  });

  const handleStatusChange = (id, newStatus) => {
    fetch(`/reservations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update reservation');
        }
        return res.json();
      })
      .then(updatedRes => {
        setReservations(reservations.map(res => 
          res.id === updatedRes.id ? updatedRes : res
        ));
      })
      .catch(err => {
        alert(err.message);
      });
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Reservation List</h2>
      <div className="filter-controls">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.guest?.name || 'Guest not found'}</td>
              <td>{reservation.room?.room_number || 'Room not found'}</td>
              <td>{new Date(reservation.check_in_date).toLocaleDateString()}</td>
              <td>{new Date(reservation.check_out_date).toLocaleDateString()}</td>
              <td>
                <select 
                  value={reservation.status} 
                  onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="checked-out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <Link to={`/reservations/new?guestId=${reservation.guest_id}`} className="action-link">
                  Rebook
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;