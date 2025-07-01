import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import styles from './ReservationForm.css'; 

const validationSchema = yup.object({
  guest_id: yup.number().required('Guest is required'),
  room_id: yup.number().required('Room is required'),
  check_in_date: yup.date().required('Check-in date is required'),
  check_out_date: yup.date()
    .required('Check-out date is required')
    .min(yup.ref('check_in_date'), 'Check-out must be after check-in'),
});

const NewReservation = () => {
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      guest_id: searchParams.get('guestId') || '',
      room_id: '',
      check_in_date: '',
      check_out_date: '',
      special_requests: ''
    },
    validationSchema,
    onSubmit: (values) => {
      fetch('/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          status: 'confirmed'
        }),
      })
      .then(res => {
        if (res.ok) {
          setSuccess(true);
          formik.resetForm();
          setTimeout(() => navigate('/reservations'), 2000);
        } else {
          throw new Error('Failed to create reservation');
        }
      })
      .catch(err => {
        alert(err.message);
      });
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const guestsRes = await fetch('/guests');
        const guestsData = await guestsRes.json();
        setGuests(guestsData);

        const roomsRes = await fetch('/rooms');
        const roomsData = await roomsRes.json();
        setRooms(roomsData.filter(room => room.status === 'available'));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>New Reservation</h2>
      {success && <div className={styles.success}>Reservation created successfully! Redirecting...</div>}
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Guest:</label>
          <select
            name="guest_id"
            value={formik.values.guest_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.select}
          >
            <option value="">Select a guest</option>
            {guests.map(guest => (
              <option key={guest.id} value={guest.id}>
                {guest.name} ({guest.email})
              </option>
            ))}
          </select>
          {formik.touched.guest_id && formik.errors.guest_id && (
            <div className={styles.error}>{formik.errors.guest_id}</div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Room:</label>
          <select
            name="room_id"
            value={formik.values.room_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.select}
          >
            <option value="">Select a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.room_number} ({room.room_type}, ${room.price})
              </option>
            ))}
          </select>
          {formik.touched.room_id && formik.errors.room_id && (
            <div className={styles.error}>{formik.errors.room_id}</div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Check-in Date:</label>
          <input
            type="date"
            name="check_in_date"
            value={formik.values.check_in_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.input}
          />
          {formik.touched.check_in_date && formik.errors.check_in_date && (
            <div className={styles.error}>{formik.errors.check_in_date}</div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Check-out Date:</label>
          <input
            type="date"
            name="check_out_date"
            value={formik.values.check_out_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.input}
          />
          {formik.touched.check_out_date && formik.errors.check_out_date && (
            <div className={styles.error}>{formik.errors.check_out_date}</div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Special Requests:</label>
          <textarea
            name="special_requests"
            value={formik.values.special_requests}
            onChange={formik.handleChange}
            className={styles.textarea}
          />
        </div>
        
        <button type="submit" className={styles.button}>Create Reservation</button>
      </form>
    </div>
  );
};

export default NewReservation;