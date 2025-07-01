import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import './RoomCalendar.css';

const RoomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, reservationsRes] = await Promise.all([
          fetch('/rooms'),
          fetch('/reservations')
        ]);
        
        const roomsData = await roomsRes.json();
        const reservationsData = await reservationsRes.json();
        
        setRooms(roomsData);
        setReservations(reservationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getRoomStatus = (roomId, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const reservation = reservations.find(res => 
      res.room_id === roomId && 
      res.check_in_date <= dateStr && 
      res.check_out_date >= dateStr &&
      ['confirmed', 'checked-in'].includes(res.status)
    );
    
    if (reservation) {
      return {
        status: 'booked',
        guest: reservation.guest?.name || 'Guest'
      };
    }
    
    const room = rooms.find(r => r.id === roomId);
    if (room && room.status === 'maintenance') {
      return {
        status: 'maintenance',
        guest: null
      };
    }
    
    return {
      status: 'available',
      guest: null
    };
  };

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevWeek}>Previous</button>
        <h2>{format(weekStart, 'MMMM yyyy')}</h2>
        <button onClick={handleNextWeek}>Next</button>
        <button onClick={handleToday}>Today</button>
      </div>
      
      <table className="calendar-table">
        <thead>
          <tr>
            <th>Room</th>
            {days.map(day => (
              <th key={day.toString()}>
                <div>{format(day, 'EEE')}</div>
                <div>{format(day, 'd')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>
                <div>{room.room_number}</div>
                <div>{room.room_type}</div>
              </td>
              {days.map(day => {
                const { status, guest } = getRoomStatus(room.id, day);
                return (
                  <td key={day.toString()} className={`status-${status}`}>
                    {status === 'booked' ? guest : status}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="legend">
        <div><span className="status-available"></span> Available</div>
        <div><span className="status-booked"></span> Booked</div>
        <div><span className="status-maintenance"></span> Maintenance</div>
      </div>
    </div>
  );
};

export default RoomCalendar;