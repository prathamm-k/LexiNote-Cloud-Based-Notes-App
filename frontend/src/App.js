import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MdSettings, MdNote, MdWbSunny, MdNightsStay, MdMenu, MdClose, MdLogout } from 'react-icons/md';
import NotesList from './components/NotesList';
import Search from './components/Search';
import Login from './components/Login';
import Register from './components/Register';
import UserSettings from './components/UserSettings';
import Header from './components/Header';
import Pagination from './components/Pagination';
import debounce from 'lodash.debounce';

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [view, setView] = useState('notes'); // 'notes' or 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch notes from backend
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/notes?pageNumber=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data.notes);
      setPages(data.pages);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [token, page]);

  // Debounced search handler (useMemo, not useCallback)
  const debouncedSearch = useMemo(() =>
    debounce(async (title) => {
      if (!title) {
        fetchNotes();
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/notes/search?title=${encodeURIComponent(title)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to search notes');
        const data = await res.json();
        setNotes(data);
        setPages(1);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }, 400)
  , [token, fetchNotes]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel && debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Update searchText and trigger search
  const handleSearchNote = (text) => {
    setSearchText(text);
    setPage(1); // Reset to first page on search
    debouncedSearch(text);
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchText(''); // Clear search when paginating
  };

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      if (data.avatarUrl && data.avatarUrl.startsWith('/')) {
        data.avatarUrl = `${BASE_URL}${data.avatarUrl}`;
      }
      setUserProfile(data);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchNotes();
    } else {
      setNotes([]);
      setUserProfile(null);
    }
  }, [token, fetchNotes, fetchUserProfile]);

  const authHandler = (data) => {
    if (data.user.avatarUrl && data.user.avatarUrl.startsWith('/')) {
      data.user.avatarUrl = `${BASE_URL}${data.user.avatarUrl}`;
    }
    setToken(data.token);
    setUserProfile(data.user);
    localStorage.setItem('token', data.token);
    setShowLogin(false);
    setView('notes');
  };

  const handleLogin = async ({ identifier, password }) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Login failed');
      authHandler(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Registration failed');
      authHandler(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  
  const handleLogout = () => {
    setToken('');
    setUserProfile(null);
    localStorage.removeItem('token');
  };
  
  const addNote = async (text) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to add note');
      fetchNotes();
    } catch (err) { setError(err.message); }
  };
  
  const deleteNote = async (id) => {
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete note');
      fetchNotes();
    } catch (err) { setError(err.message); }
  };

  const updateNote = async (id, text) => {
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to update note');
      fetchNotes();
    } catch (err) { setError(err.message); }
  };

  const onUpdateEmail = async (email, username) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      await fetchUserProfile();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const onUpdatePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/user/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      // Optionally show a success message
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  
  const onAvatarUpload = async (avatarFile) => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      const res = await fetch(`${API_URL}/user/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to upload avatar');
      await fetchUserProfile();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
        <button className="theme-toggle auth-theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <MdWbSunny /> : <MdNightsStay />}
        </button>
        <div className="auth-page-split">
          <div className="auth-branding">
            <h1 className="auth-logo">LexiNote</h1>
            <p className="tagline">Write freely. Access instantly. Think clearly.</p>
            <p className="description">
            LexiNote is a cloud-based note-taking app that lets you write, save, and access your notes seamlessly from any device. Whether you're jotting down quick ideas or organizing detailed thoughts, LexiNote ensures your content is always synced, secure, and accessible online — anytime, anywhere.
            </p>
          </div>
          <div className="auth-container-panel">
            {showLogin ? (
              <Login handleLogin={handleLogin} loading={loading} error={error} onSwitch={() => setShowLogin(false)} />
            ) : (
              <Register handleRegister={handleRegister} loading={loading} error={error} onSwitch={() => setShowLogin(true)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='app-layout'>
      <nav className={`sidebar${sidebarOpen ? '' : ' closed'}`}>
        <div className="sidebar-header">
          <h1>LexiNote</h1>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
        <div className="sidebar-user">
          <img src={userProfile?.avatarUrl || '/default-avatar.png'} alt="avatar" />
          <span>{userProfile?.username}</span>
        </div>
        <ul className="nav-menu">
          <li className={view === 'notes' ? 'active' : ''} onClick={() => setView('notes')}><MdNote /> <span>Notes</span></li>
          <li className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}><MdSettings /> <span>Settings</span></li>
        </ul>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <MdWbSunny /> : <MdNightsStay />}
          </button>
          <button onClick={handleLogout} className="primary-btn logout-btn">
            <MdLogout /> <span>Logout</span>
          </button>
        </div>
      </nav>
      <main className="main-content">
        {view === 'notes' && (
          <div className="page-transition" key="notes">
            <Header />
            <Search handleSearchNote={handleSearchNote} />
            {loading && <div className="spinner-container"><div className="spinner"></div></div>}
            {error && <div className="error-msg">{error}</div>}
            <NotesList notes={notes} handleAddNote={addNote} handleDeleteNote={deleteNote} handleUpdateNote={updateNote} />
            {searchText === '' && (
              <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
            )}
          </div>
        )}
        {view === 'settings' && (
          <div className="page-transition" key="settings">
            <UserSettings 
              userEmail={userProfile?.email} 
              username={userProfile?.username}
              avatarUrl={userProfile?.avatarUrl}
              onUpdateEmail={onUpdateEmail}
              onUpdatePassword={onUpdatePassword}
              onAvatarUpload={onAvatarUpload}
              loading={loading} 
              error={error} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;