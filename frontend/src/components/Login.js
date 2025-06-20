import React, { useState } from 'react';

const Login = ({ handleLogin, loading, error, onSwitch }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin({ identifier, password });
  };

  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2 className="auth-title">Welcome Back!</h2>
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error-msg">{error}</div>}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-switch">
          Don't have an account? <span onClick={onSwitch}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login; 