import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('token', 'dummy-token'); // Optional: just to mimic login state
      navigate('/dashboard');
    } catch (err) {
      setError('Login Failed');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
