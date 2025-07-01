import React, { useState, useEffect } from 'react';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/rooms')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch rooms');
        }
        return res.json();
      })
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  });

  const handleStatusChange = (id, newStatus) => {
    fetch(`/rooms/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update room');
        }
        return res.json();
      })
      .then(updatedRoom => {
        setRooms(rooms.map(room => 
          room.id === updatedRoom.id ? updatedRoom : room
        ));
      })
      .catch(err => {
        alert(err.message);
      });
  };

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Room Inventory</h2>
      <div className="filter-controls">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Type</th>
            <th>Price</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Amenities</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map(room => (
            <tr key={room.id}>
              <td>{room.room_number}</td>
              <td>{room.room_type}</td>
              <td>${room.price.toFixed(2)}</td>
              <td>{room.capacity}</td>
              <td>
                <select 
                  value={room.status} 
                  onChange={(e) => handleStatusChange(room.id, e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </td>
              <td>
                {room.amenities?.map(a => a.name).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;