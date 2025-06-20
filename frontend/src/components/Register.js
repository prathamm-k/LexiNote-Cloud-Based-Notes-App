import React, { useState } from 'react';

const Register = ({ handleRegister, loading, error, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!username.trim()) {
      setLocalError('Username is required');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    handleRegister({ username, email, password });
  };

  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2 className="auth-title">Create an Account</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        {(localError || error) && <div className="error-msg">{localError || error}</div>}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="auth-switch">
          Already have an account? <span onClick={onSwitch}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register; 