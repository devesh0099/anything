import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  
  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:7000/admin/support', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSupport();
  }, []);

  return (
    <div>
      <h2>Support Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>{ticket.subject} - {ticket.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Support;
