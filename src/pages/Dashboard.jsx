// 📁 src/pages/Dashboard.jsx (UPDATED WITH SCHOOL NAME & CLASS)
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, updateProfile, getMyMessages, getMyStats, axiosInstance } = useAuth();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    city: user?.city || '',
    schoolName: user?.schoolName || '',     // ✅ NEW
    className: user?.className || '',        // ✅ NEW
    whatsappOptIn: user?.whatsappOptIn ?? true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchMessages(), fetchStats()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await getMyMessages();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getMyStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  // ✅ Class options for edit mode
  const classOptions = [
    'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
    '1st Year College', '2nd Year College', '3rd Year College', '4th Year College',
    'Postgraduate', 'PhD', 'Diploma', 'Other'
  ];

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-large"></div>
          <p style={{ marginTop: '20px' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
        {/* Welcome Banner - UPDATED with School Name */}
        <div className="welcome-banner">
          <div>
            <h2>Namaste, {user?.fullName?.split(' ')[0]}! 🙏</h2>
            <p style={{ fontSize: '16px', marginBottom: '5px' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px' }}>
                🏫 {user?.schoolName || 'School not specified'}
              </span>
            </p>
            <p>
              📚 {user?.className || 'Class not specified'} • {user?.city || 'India'}
            </p>
            <p style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
              📲 WhatsApp updates: {user?.whatsappOptIn ? '✅ Active' : '❌ Paused'}
            </p>
          </div>
          <div className="welcome-emoji">📚</div>
        </div>

        {/* Stats */}
        {!loadingStats && stats && (
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
        )}

        {/* Message Schedule Info */}
        <div className="card">
          <div className="card-header">
            <h3>📲 Your WhatsApp Schedule</h3>
          </div>
          <div className="schedule-grid">
            <div className="schedule-item">
              <div className="schedule-icon">📅</div>
              <h4>Weekly</h4>
              <p>Every Monday 9:00 AM</p>
            </div>
            <div className="schedule-item">
              <div className="schedule-icon">🗓️</div>
              <h4>Monthly</h4>
              <p>1st of month 10:00 AM</p>
            </div>
            <div className="schedule-item">
              <div className="schedule-icon">🎊</div>
              <h4>Yearly</h4>
              <p>January 1st 12:00 AM</p>
            </div>
          </div>
        </div>

        {/* Profile Section - UPDATED with School Name & Class */}
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
                  required
                />
              </div>
              
              {/* ✅ NEW - Edit School Name */}
              <div className="form-group">
                <label>School / College Name</label>
                <input
                  value={profileData.schoolName}
                  onChange={e => setProfileData({ ...profileData, schoolName: e.target.value })}
                  type="text"
                  placeholder="Your school/college name"
                  required
                />
              </div>
              
              {/* ✅ NEW - Edit Class */}
              <div className="form-group">
                <label>Class / Year</label>
                <select
                  value={profileData.className}
                  onChange={e => setProfileData({ ...profileData, className: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">Select Class</option>
                  {classOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
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
              
              {/* ✅ NEW - School Name Display */}
              <div className="profile-item">
                <label>🏫 School/College</label>
                <p style={{ fontWeight: 600, color: '#4a5568' }}>
                  {user?.schoolName || 'Not specified'}
                </p>
              </div>
              
              {/* ✅ NEW - Class Display */}
              <div className="profile-item">
                <label>📚 Class/Year</label>
                <p style={{ fontWeight: 600, color: '#4a5568' }}>
                  {user?.className || 'Not specified'}
                </p>
              </div>
              
              <div className="profile-item">
                <label>City</label>
                <p>{user?.city || '—'}</p>
              </div>
              <div className="profile-item">
                <label>Member Since</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : '—'}</p>
              </div>
              <div className="profile-item">
                <label>WhatsApp Status</label>
                <p style={{ 
                  color: user?.whatsappOptIn ? '#48bb78' : '#f56565',
                  fontWeight: 600 
                }}>
                  {user?.whatsappOptIn ? '✅ Active' : '❌ Paused'}
                </p>
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
              <p>No messages yet. Messages will start arriving soon!</p>
              <p style={{ fontSize: 13, marginTop: 10, color: '#667eea' }}>
                ⏱️ Check back in a few minutes
              </p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((msg) => (
                <div key={msg._id} className="message-item">
                  <span className={`message-badge badge-${msg.type}`}>{msg.type}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: 'var(--dark)', marginBottom: 4 }}>
                      {msg.message?.substring(0, 60)}...
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--gray)' }}>
                      To: {msg.phone}
                    </p>
                  </div>
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

        {/* ✅ NEW - Quick Info Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px',
          border: '2px solid #667eea30',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <span style={{ fontSize: '14px', color: '#4a5568' }}>📊 Your Stats</span>
            <h3 style={{ marginTop: '5px', color: '#2d3748' }}>
              {stats?.total || 0} Total Messages
            </h3>
            <p style={{ fontSize: '13px', color: '#718096' }}>
              Last message: {user?.lastMessageSent ? formatDate(user.lastMessageSent) : 'No messages yet'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ 
              padding: '8px 16px', 
              background: user?.whatsappOptIn ? '#48bb78' : '#f56565',
              color: 'white',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: 600
            }}>
              {user?.whatsappOptIn ? '📱 WhatsApp Active' : '📱 WhatsApp Paused'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;