import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    guests: 0,
    rooms: 0,
    reservations: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    revenue: 0,
    amenities: 0
  });
  const [recentGuests, setRecentGuests] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          guestsRes, 
          roomsRes, 
          reservationsRes,
          availabilityRes,
          recentGuestsRes,
          upcomingReservationsRes
        ] = await Promise.all([
          fetch('/guests'),
          fetch('/rooms'),
          fetch('/reservations'),
          fetch('/rooms/availability'),
          fetch('/guests?_sort=created_at&_order=desc&_limit=5'),
          fetch('/reservations?check_in_date_gte=today&_sort=check_in_date&_order=asc&_limit=5')
        ]);

        if (!guestsRes.ok || !roomsRes.ok || !reservationsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const guests = await guestsRes.json();
        const rooms = await roomsRes.json();
        const reservations = await reservationsRes.json();
        const availability = await availabilityRes.json();
        const recentGuestsData = await recentGuestsRes.json();
        const upcomingReservationsData = await upcomingReservationsRes.json();

        const today = new Date().toISOString().split('T')[0];
        const todayCheckIns = reservations.filter(r => r.check_in_date === today).length;
        const todayCheckOuts = reservations.filter(r => r.check_out_date === today).length;

        setStats({
          guests: guests.length,
          rooms: rooms.length,
          reservations: reservations.length,
          availableRooms: availability.filter(r => r.available).length,
          occupiedRooms: availability.filter(r => !r.available).length,
          maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
          todayCheckIns,
          todayCheckOuts,
          revenue: reservations.reduce((sum, r) => sum + (r.room?.price || 0), 0),
          amenities: rooms.reduce((sum, r) => sum + (r.amenities?.length || 0), 0)
        });

        setRecentGuests(recentGuestsData);
        setUpcomingReservations(upcomingReservationsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Summary Cards */}
        <div className="stat-card total-guests">
          <h3>Total Guests</h3>
          <p>{stats.guests}</p>
          <div className="stat-icon">👥</div>
        </div>

        <div className="stat-card total-rooms">
          <h3>Total Rooms</h3>
          <p>{stats.rooms}</p>
          <div className="stat-icon">🛏️</div>
        </div>

        <div className="stat-card total-reservations">
          <h3>Total Reservations</h3>
          <p>{stats.reservations}</p>
          <div className="stat-icon">📅</div>
        </div>

        <div className="stat-card available-rooms">
          <h3>Available Rooms</h3>
          <p>{stats.availableRooms}</p>
          <div className="stat-icon">✅</div>
        </div>

        <div className="stat-card occupied-rooms">
          <h3>Occupied Rooms</h3>
          <p>{stats.occupiedRooms}</p>
          <div className="stat-icon">🚫</div>
        </div>

        <div className="stat-card maintenance-rooms">
          <h3>Maintenance Rooms</h3>
          <p>{stats.maintenanceRooms}</p>
          <div className="stat-icon">🔧</div>
        </div>

        <div className="stat-card today-checkins">
          <h3>Today's Check-Ins</h3>
          <p>{stats.todayCheckIns}</p>
          <div className="stat-icon">🔑</div>
        </div>

        <div className="stat-card today-checkouts">
          <h3>Today's Check-Outs</h3>
          <p>{stats.todayCheckOuts}</p>
          <div className="stat-icon">🚪</div>
        </div>

        <div className="stat-card total-revenue">
          <h3>Total Revenue</h3>
          <p>${stats.revenue.toLocaleString()}</p>
          <div className="stat-icon">💰</div>
        </div>

        <div className="stat-card total-amenities">
          <h3>Total Amenities</h3>
          <p>{stats.amenities}</p>
          <div className="stat-icon">🏊</div>
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="recent-guests">
          <h2>Recent Guests</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentGuests.map(guest => (
                <tr key={guest.id}>
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>{guest.phone}</td>
                  <td>{new Date(guest.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="upcoming-reservations">
          <h2>Upcoming Reservations</h2>
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {upcomingReservations.map(res => (
                <tr key={res.id}>
                  <td>{res.guest?.name || 'N/A'}</td>
                  <td>{res.room?.room_number || 'N/A'}</td>
                  <td>{new Date(res.check_in_date).toLocaleDateString()}</td>
                  <td>{new Date(res.check_out_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;