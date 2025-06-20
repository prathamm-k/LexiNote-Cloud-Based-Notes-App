import React, { useState } from 'react';

const UserSettings = ({ userEmail, username, avatarUrl, onUpdateEmail, onUpdatePassword, onAvatarUpload, loading, error }) => {
  const [email, setEmail] = useState(userEmail || '');
  const [newUsername, setNewUsername] = useState(username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if ((email && email !== userEmail) || (newUsername && newUsername !== username)) {
      onUpdateEmail(email, newUsername);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (!currentPassword || !newPassword) {
      setLocalError('Please fill all password fields');
      return;
    }
    onUpdatePassword(currentPassword, newPassword);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAvatarUpdate = (e) => {
    e.preventDefault();
    if (avatar) {
      onAvatarUpload(avatar);
    }
  };

  return (
    <div className="settings-container">
      <h2>User Settings</h2>
      <form onSubmit={handleAvatarUpdate} className="settings-form">
        <label>Avatar</label>
        <div className="avatar-section">
          <img src={avatarPreview || '/default-avatar.png'} alt="avatar" className="avatar-img" />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <button type="submit" className="primary-btn" disabled={loading || !avatar}>{loading ? 'Updating...' : 'Update Avatar'}</button>
        </div>
      </form>
      <form onSubmit={handleEmailSubmit} className="settings-form">
        <label>Username</label>
        <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Updating...' : 'Update Profile'}</button>
      </form>
      <form onSubmit={handlePasswordSubmit} className="settings-form">
        <label>Current Password</label>
        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
        <label>New Password</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <label>Confirm New Password</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        {(localError || error) && <div className="error-msg">{localError || error}</div>}
        <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
      </form>
    </div>
  );
};

export default UserSettings; 