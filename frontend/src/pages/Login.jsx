import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
          Sign In
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        New Customer? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
      </div>
    </div>
  );
};

export default Login;
