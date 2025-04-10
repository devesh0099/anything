import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:7000/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Tickets Sold: {dashboardData.totalTickets}</p>
      <p>Total Revenue: {dashboardData.totalRevenue}</p>
    </div>
  );
};

export default Dashboard;
