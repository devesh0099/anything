import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_date_time: '',
    end_date_time: '',
    venue: '',
    status: 'Draft'
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:7000/admin/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:7000/admin/events', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Events</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required /><br />
        <input name="start_date_time" placeholder="Start DateTime" value={form.start_date_time} onChange={handleChange} required /><br />
        <input name="end_date_time" placeholder="End DateTime" value={form.end_date_time} onChange={handleChange} required /><br />
        <input name="venue" placeholder="Venue" value={form.venue} onChange={handleChange} required /><br />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Paused">Paused</option>
          <option value="Cancelled">Cancelled</option>
        </select><br />
        <button type="submit">Create Event</button>
      </form>
      <hr />
      <h3>All Events</h3>
      <ul>
        {events.map(ev => <li key={ev.id}>{ev.title} - {ev.status}</li>)}
      </ul>
    </div>
  );
};

export default Events;
