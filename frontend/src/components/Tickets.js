import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    event_id: '',
    ticket_type: '',
    price: '',
    seat_info: '',
    availability: ''
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:7000/admin/tickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:7000/admin/tickets', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Tickets</h2>
      <form onSubmit={handleSubmit}>
        <input name="event_id" placeholder="Event ID" value={form.event_id} onChange={handleChange} required /><br />
        <input name="ticket_type" placeholder="Ticket Type" value={form.ticket_type} onChange={handleChange} required /><br />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required /><br />
        <input name="seat_info" placeholder="Seat Info" value={form.seat_info} onChange={handleChange} /><br />
        <input name="availability" placeholder="Availability" value={form.availability} onChange={handleChange} required /><br />
        <button type="submit">Create Ticket</button>
      </form>
      <hr />
      <h3>All Tickets</h3>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
            Event ID: {ticket.event_id}, Type: {ticket.ticket_type}, Price: {ticket.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tickets;
