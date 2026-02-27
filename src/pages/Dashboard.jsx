import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    city: user?.city || '',
    whatsappOptIn: user?.whatsappOptIn ?? true
  });

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/activity/my-messages');
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/activity/stats');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Error fetching stats');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span>🎓</span>
          Student Platform
        </div>
        <div className="navbar-user">
          <div className="user-avatar">{getInitials(user?.fullName)}</div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{user?.fullName}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div>
            <h2>Namaste, {user?.fullName?.split(' ')[0]}! 🙏</h2>
            <p>
              {user?.institutionName} • {user?.classYear} • {user?.city || 'India'}
            </p>
            <p style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
              📲 WhatsApp updates: {user?.whatsappOptIn ? '✅ Active' : '❌ Paused'}
            </p>
          </div>
          <div className="welcome-emoji">📚</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">📅</div>
            <div className="stat-info">
              <h3>{stats?.weekly || 0}</h3>
              <p>Weekly Messages</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🗓️</div>
            <div className="stat-info">
              <h3>{stats?.monthly || 0}</h3>
              <p>Monthly Messages</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">🎊</div>
            <div className="stat-info">
              <h3>{stats?.yearly || 0}</h3>
              <p>Yearly Messages</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">📨</div>
            <div className="stat-info">
              <h3>{stats?.total || 0}</h3>
              <p>Total Received</p>
            </div>
          </div>
        </div>

        {/* Message Schedule Info */}
        <div className="card">
          <div className="card-header">
            <h3>📲 Your WhatsApp Schedule</h3>
          </div>
          <div className="schedule-grid">
            <div className="schedule-item">
              <div className="schedule-icon">📅</div>
              <h4>Weekly</h4>
              <p>Every Monday</p>
              <p>9:00 AM IST</p>
            </div>
            <div className="schedule-item">
              <div className="schedule-icon">🗓️</div>
              <h4>Monthly</h4>
              <p>1st of every month</p>
              <p>10:00 AM IST</p>
            </div>
            <div className="schedule-item">
              <div className="schedule-icon">🎊</div>
              <h4>Yearly</h4>
              <p>January 1st</p>
              <p>12:00 AM IST</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="card">
          <div className="card-header">
            <h3>👤 My Profile</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={profileData.fullName}
                  onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  value={profileData.city}
                  onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                  type="text"
                  placeholder="Your city"
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={profileData.whatsappOptIn}
                    onChange={e => setProfileData({ ...profileData, whatsappOptIn: e.target.checked })}
                    style={{ width: 'auto' }}
                  />
                  Receive WhatsApp activity messages
                </label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '10px 24px' }}>
                Save Changes
              </button>
            </form>
          ) : (
            <div className="profile-grid">
              <div className="profile-item">
                <label>Full Name</label>
                <p>{user?.fullName}</p>
              </div>
              <div className="profile-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="profile-item">
                <label>WhatsApp Number</label>
                <p>{user?.phone}</p>
              </div>
              <div className="profile-item">
                <label>Institution</label>
                <p>{user?.institutionName}</p>
              </div>
              <div className="profile-item">
                <label>Type</label>
                <p style={{ textTransform: 'capitalize' }}>{user?.institutionType}</p>
              </div>
              <div className="profile-item">
                <label>Class / Year</label>
                <p>{user?.classYear}</p>
              </div>
              <div className="profile-item">
                <label>City</label>
                <p>{user?.city || '—'}</p>
              </div>
              <div className="profile-item">
                <label>Member Since</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Message History */}
        <div className="card">
          <div className="card-header">
            <h3>📨 WhatsApp Message History</h3>
            <span style={{ fontSize: 13, color: 'var(--gray)' }}>Last 50 messages</span>
          </div>

          {loadingMessages ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'var(--gray)', fontSize: 15
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p>No messages yet. Your first message will arrive next Monday!</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((msg) => (
                <div key={msg._id} className="message-item">
                  <span className={`message-badge badge-${msg.type}`}>{msg.type}</span>
                  <span style={{ fontSize: 14, color: 'var(--dark)', flex: 1 }}>
                    WhatsApp message sent to {msg.phone}
                  </span>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: msg.status === 'sent' ? 'rgba(40,167,69,0.12)' : 'rgba(220,53,69,0.12)',
                    color: msg.status === 'sent' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {msg.status === 'sent' ? '✓ Sent' : '✗ Failed'}
                  </span>
                  <span className="msg-date">{formatDate(msg.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;