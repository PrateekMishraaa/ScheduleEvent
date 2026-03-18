// 📁 src/pages/Dashboard.jsx (BEAUTIFUL ENHANCED VERSION)
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  FiMail, FiCalendar, FiClock, FiUser, FiLogOut, 
  FiEdit2, FiSave, FiX, FiRefreshCw, FiBell, 
  FiMessageSquare, FiCheckCircle, FiXCircle, 
  FiClock as FiPending, FiAward, FiTrendingUp,
  FiStar, FiSun, FiMoon, FiSettings
} from 'react-icons/fi';
import { 
  BsChatDots, BsChatQuote, BsGraphUp, 
  BsBook, BsTrophy, BsLightbulb 
} from 'react-icons/bs';
import { MdSchool, MdClass, MdLocationCity, MdPhone } from 'react-icons/md';

const Dashboard = () => {
  const { user, logout, updateProfile, getMyMessages, getMyStats, axiosInstance } = useAuth();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    city: user?.city || '',
    schoolName: user?.schoolName || '',
    className: user?.className || '',
    whatsappOptIn: user?.whatsappOptIn ?? true
  });

  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    fetchData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchMessages(true);
      }, 30000);
    }
    
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    
    return () => {
      if (interval) clearInterval(interval);
      clearTimeout(timer);
    };
  }, [autoRefresh]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchMessages(), fetchStats()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchMessages = async (silent = false) => {
    try {
      if (!silent) setLoadingMessages(true);
      const data = await getMyMessages();
      setMessages(data.messages || []);
      setLastUpdated(new Date());
      
      if (!silent && data.messages?.length > 0) {
        const lastMessage = data.messages[0];
        if (new Date(lastMessage.createdAt) > new Date(Date.now() - 31000)) {
          toast.success('📲 New message received!', {
            icon: '📨',
            duration: 3000,
            style: {
              background: darkMode ? '#1a202c' : '#fff',
              color: darkMode ? '#fff' : '#1a202c',
              border: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching messages');
      if (!silent) toast.error('Failed to load messages');
    } finally {
      if (!silent) setLoadingMessages(false);
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
      toast.success('Profile updated successfully!', {
        icon: '✨',
        style: {
          background: darkMode ? '#1a202c' : '#fff',
          color: darkMode ? '#fff' : '#1a202c'
        }
      });
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return d.toLocaleString('en-IN', {
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

  const getMessageTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'weekly': return { icon: <FiCalendar />, color: '#4299e1', bg: '#ebf8ff' };
      case 'monthly': return { icon: <FiStar />, color: '#ed8936', bg: '#fffaf0' };
      case 'yearly': return { icon: <FiAward />, color: '#9f7aea', bg: '#faf5ff' };
      case 'test': return { icon: <FiSettings />, color: '#48bb78', bg: '#f0fff4' };
      default: return { icon: <FiMessageSquare />, color: '#718096', bg: '#f7fafc' };
    }
  };

  const getMessageStatusBadge = (status) => {
    switch(status) {
      case 'sent':
        return { 
          icon: <FiCheckCircle />, 
          text: 'Delivered', 
          color: '#48bb78',
          bg: '#f0fff4'
        };
      case 'failed':
        return { 
          icon: <FiXCircle />, 
          text: 'Failed', 
          color: '#f56565',
          bg: '#fff5f5'
        };
      case 'pending':
        return { 
          icon: <FiPending />, 
          text: 'Pending', 
          color: '#ecc94b',
          bg: '#fffff0'
        };
      default:
        return { 
          icon: <FiClock />, 
          text: status || 'Unknown', 
          color: '#a0aec0',
          bg: '#f7fafc'
        };
    }
  };

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
          <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 500 }}>
            Loading your magical dashboard...
          </p>
        </div>
      </div>
    );
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
        : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      color: darkMode ? '#fff' : '#1a202c',
      transition: 'all 0.3s ease'
    },
    navbar: {
      background: darkMode 
        ? 'rgba(26, 32, 44, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: darkMode 
        ? '0 4px 6px rgba(0,0,0,0.3)'
        : '0 4px 6px rgba(0,0,0,0.1)'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    card: {
      background: darkMode ? '#2d3748' : '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: darkMode
        ? '0 8px 20px rgba(0,0,0,0.3)'
        : '0 8px 20px rgba(0,0,0,0.08)',
      border: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Welcome Toast */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          zIndex: 2000,
          animation: 'slideIn 0.5s ease, fadeOut 0.5s ease 4.5s forwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiSun size={24} />
            <div>
              <h4 style={{ margin: 0, fontSize: '16px' }}>Welcome back, {user.fullName.split(' ')[0]}! 🌟</h4>
              <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>
                You have {stats?.total || 0} messages received
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.brand}>
          <BsChatDots size={28} color="#667eea" />
          <span>EduConnect</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'none',
              border: 'none',
              color: darkMode ? '#fff' : '#1a202c',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.3s ease'
            }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {getInitials(user?.fullName)}
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: darkMode ? '#fff' : '#1a202c' }}>
              {user?.fullName}
            </span>
            <button
              onClick={logout}
              style={{
                background: darkMode ? '#4a5568' : '#f7fafc',
                border: `1px solid ${darkMode ? '#718096' : '#e2e8f0'}`,
                color: darkMode ? '#fff' : '#4a5568',
                padding: '8px 16px',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Welcome Banner */}
        <div style={{
          ...styles.card,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'pulse 3s infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'pulse 4s infinite reverse'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>
                Namaste, {user?.fullName?.split(' ')[0]}! 🙏
              </h2>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '30px', fontSize: '14px' }}>
                  <MdSchool style={{ marginRight: '6px' }} /> {user?.schoolName || 'School not specified'}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '30px', fontSize: '14px' }}>
                  <MdClass style={{ marginRight: '6px' }} /> {user?.className || 'Class not specified'}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '30px', fontSize: '14px' }}>
                  <MdLocationCity style={{ marginRight: '6px' }} /> {user?.city || 'India'}
                </span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                <MdPhone style={{ marginRight: '6px' }} /> {user?.phone}
              </p>
            </div>
            <div style={{
              fontSize: '80px',
              opacity: 0.8,
              animation: 'float 3s ease-in-out infinite'
            }}>
              <BsChatQuote />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {!loadingStats && stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {[
              { label: 'Weekly Messages', value: stats?.weekly || 0, icon: <FiCalendar />, color: '#4299e1' },
              { label: 'Monthly Messages', value: stats?.monthly || 0, icon: <FiStar />, color: '#ed8936' },
              { label: 'Yearly Messages', value: stats?.yearly || 0, icon: <FiAward />, color: '#9f7aea' },
              { label: 'Total Received', value: stats?.total || 0, icon: <BsGraphUp />, color: '#48bb78' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  ...styles.card,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s`
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: darkMode ? '#fff' : '#1a202c' }}>
                    {stat.value}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: darkMode ? '#a0aec0' : '#718096' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule & Profile Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Schedule Card */}
          <div style={styles.card}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`
            }}>
              <FiClock size={24} color="#667eea" />
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Message Schedule</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: <FiCalendar />, title: 'Weekly', time: 'Every Monday 9:00 AM', desc: 'Motivational quotes & updates', color: '#4299e1' },
                { icon: <FiStar />, title: 'Monthly', time: '1st of month 10:00 AM', desc: 'Progress report & achievements', color: '#ed8936' },
                { icon: <FiAward />, title: 'Yearly', time: 'January 1st 12:00 AM', desc: 'Annual summary & goals', color: '#9f7aea' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    fontSize: '20px'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>
                      {item.title}
                    </h4>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: darkMode ? '#a0aec0' : '#718096' }}>
                      {item.time}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: darkMode ? '#718096' : '#a0aec0' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <div style={styles.card}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiUser size={24} color="#667eea" />
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>My Profile</h3>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  background: editMode ? '#f56565' : '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {editMode ? <FiX /> : <FiEdit2 />}
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleProfileUpdate}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                      Full Name
                    </label>
                    <input
                      value={profileData.fullName}
                      onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                      type="text"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        background: darkMode ? '#2d3748' : '#fff',
                        color: darkMode ? '#fff' : '#1a202c'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                      School / College
                    </label>
                    <input
                      value={profileData.schoolName}
                      onChange={e => setProfileData({ ...profileData, schoolName: e.target.value })}
                      type="text"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        background: darkMode ? '#2d3748' : '#fff',
                        color: darkMode ? '#fff' : '#1a202c'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                      Class / Year
                    </label>
                    <select
                      value={profileData.className}
                      onChange={e => setProfileData({ ...profileData, className: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        background: darkMode ? '#2d3748' : '#fff',
                        color: darkMode ? '#fff' : '#1a202c'
                      }}
                      required
                    >
                      <option value="">Select Class</option>
                      {classOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                      City
                    </label>
                    <input
                      value={profileData.city}
                      onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        background: darkMode ? '#2d3748' : '#fff',
                        color: darkMode ? '#fff' : '#1a202c'
                      }}
                    />
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    background: darkMode ? '#4a5568' : '#f7fafc',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <input
                      type="checkbox"
                      checked={profileData.whatsappOptIn}
                      onChange={e => setProfileData({ ...profileData, whatsappOptIn: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <label style={{ fontSize: '14px', cursor: 'pointer' }}>
                      Receive WhatsApp activity messages
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FiSave /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096', marginBottom: '4px' }}>
                    <FiUser style={{ marginRight: '4px', display: 'inline' }} /> Full Name
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 500 }}>{user?.fullName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096', marginBottom: '4px' }}>
                    <FiMail style={{ marginRight: '4px', display: 'inline' }} /> Email
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 500 }}>{user?.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096', marginBottom: '4px' }}>
                    <MdSchool /> School
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#667eea' }}>
                    {user?.schoolName || '—'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096', marginBottom: '4px' }}>
                    <MdClass /> Class
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#9f7aea' }}>
                    {user?.className || '—'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096', marginBottom: '4px' }}>
                    <MdLocationCity /> City
                  </p>
                  <p style={{ fontSize: '15px' }}>{user?.city || '—'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096', marginBottom: '4px' }}>
                    <FiBell /> WhatsApp Status
                  </p>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: user?.whatsappOptIn ? '#48bb78' : '#f56565'
                  }}>
                    {user?.whatsappOptIn ? '✅ Active' : '❌ Paused'}
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <p style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096', marginBottom: '4px' }}>
                    Member Since
                  </p>
                  <p style={{ fontSize: '14px' }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : '—'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Section */}
        <div style={styles.card}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiMessageSquare size={24} color="#667eea" />
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Message History</h3>
              <span style={{
                fontSize: '12px',
                color: darkMode ? '#a0aec0' : '#718096',
                background: darkMode ? '#4a5568' : '#f7fafc',
                padding: '4px 10px',
                borderRadius: '20px'
              }}>
                Last updated: {formatDate(lastUpdated)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                style={{
                  background: autoRefresh ? '#48bb78' : darkMode ? '#4a5568' : '#e2e8f0',
                  color: autoRefresh ? 'white' : darkMode ? '#fff' : '#4a5568',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FiRefreshCw className={autoRefresh ? 'spin' : ''} />
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              <button
                onClick={() => fetchMessages(false)}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FiRefreshCw /> Refresh
              </button>
            </div>
          </div>

          {loadingMessages ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="spinner" style={{ margin: '20px auto' }}></div>
              <p style={{ color: darkMode ? '#a0aec0' : '#718096' }}>
                Loading your messages...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>
                <BsChatDots />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: darkMode ? '#fff' : '#1a202c' }}>
                No messages yet!
              </h3>
              <p style={{ color: darkMode ? '#a0aec0' : '#718096', maxWidth: '400px', margin: '0 auto' }}>
                Your messages will appear here once the cronjob starts sending them.
                Check back after the scheduled times.
              </p>
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: darkMode ? '#4a5568' : '#f7fafc',
                borderRadius: '12px',
                display: 'inline-block'
              }}>
                <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '10px' }}>
                  ⏰ Next scheduled messages:
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#a0aec0' : '#718096' }}>
                  📅 Weekly: Every Monday 9:00 AM<br />
                  🗓️ Monthly: 1st of month 10:00 AM<br />
                  🎊 Yearly: January 1st 12:00 AM
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Message Stats Summary */}
              <div style={{
                display: 'flex',
                gap: '20px',
                padding: '15px 20px',
                background: darkMode ? '#4a5568' : '#f7fafc',
                borderRadius: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '14px' }}>
                  <FiMessageSquare style={{ marginRight: '6px' }} />
                  Total: <strong>{messages.length}</strong>
                </span>
                <span style={{ fontSize: '14px', color: '#48bb78' }}>
                  <FiCheckCircle style={{ marginRight: '6px' }} />
                  Sent: <strong>{messages.filter(m => m.status === 'sent').length}</strong>
                </span>
                <span style={{ fontSize: '14px', color: '#ecc94b' }}>
                  <FiPending style={{ marginRight: '6px' }} />
                  Pending: <strong>{messages.filter(m => m.status === 'pending').length}</strong>
                </span>
                <span style={{ fontSize: '14px', color: '#f56565' }}>
                  <FiXCircle style={{ marginRight: '6px' }} />
                  Failed: <strong>{messages.filter(m => m.status === 'failed').length}</strong>
                </span>
              </div>

              {/* Message List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg, index) => {
                  const typeStyle = getMessageTypeIcon(msg.type);
                  const statusBadge = getMessageStatusBadge(msg.status);
                  
                  return (
                    <div
                      key={msg._id || index}
                      onClick={() => setSelectedMessage(selectedMessage === msg._id ? null : msg._id)}
                      style={{
                        ...styles.card,
                        padding: '16px 20px',
                        cursor: 'pointer',
                        borderLeft: `4px solid ${typeStyle.color}`,
                        transition: 'all 0.3s ease',
                        animation: `fadeInUp 0.3s ease ${index * 0.05}s`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: typeStyle.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: typeStyle.color,
                          fontSize: '20px'
                        }}>
                          {typeStyle.icon}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{
                              background: typeStyle.bg,
                              color: typeStyle.color,
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}>
                              {msg.type || 'Cronjob'}
                            </span>
                            <span style={{ fontSize: '12px', color: darkMode ? '#a0aec0' : '#718096' }}>
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          
                          <p style={{
                            fontSize: '14px',
                            color: darkMode ? '#fff' : '#1a202c',
                            margin: 0,
                            lineHeight: '1.5'
                          }}>
                            {msg.message?.length > 100 && selectedMessage !== msg._id
                              ? msg.message.substring(0, 100) + '...'
                              : msg.message}
                          </p>
                          
                          {selectedMessage === msg._id && (
                            <div style={{
                              marginTop: '12px',
                              padding: '12px',
                              background: darkMode ? '#4a5568' : '#f7fafc',
                              borderRadius: '8px',
                              fontSize: '13px'
                            }}>
                              <p style={{ margin: '0 0 8px', color: darkMode ? '#a0aec0' : '#718096' }}>
                                <strong>Message Details:</strong>
                              </p>
                              <p style={{ margin: '4px 0' }}>📱 To: {msg.phone}</p>
                              {msg.scheduledFor && (
                                <p style={{ margin: '4px 0' }}>⏰ Scheduled: {formatDate(msg.scheduledFor)}</p>
                              )}
                              {msg.sentAt && msg.status === 'sent' && (
                                <p style={{ margin: '4px 0' }}>✓ Sent at: {formatDate(msg.sentAt)}</p>
                              )}
                              {msg.twilioSid && (
                                <p style={{ margin: '4px 0', fontSize: '11px', color: darkMode ? '#718096' : '#a0aec0' }}>
                                  SID: {msg.twilioSid}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '30px',
                            fontSize: '13px',
                            fontWeight: 600,
                            background: statusBadge.bg,
                            color: statusBadge.color
                          }}>
                            {statusBadge.icon}
                            {statusBadge.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View More */}
              {messages.length >= 20 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button style={{
                    background: 'none',
                    border: `2px solid #667eea`,
                    color: '#667eea',
                    padding: '12px 30px',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    Load More Messages →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Status Footer */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: darkMode ? '#2d3748' : '#fff',
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: user?.whatsappOptIn ? '#48bb78' : '#f56565',
              animation: user?.whatsappOptIn ? 'pulse 2s infinite' : 'none'
            }} />
            <span style={{ fontSize: '14px', color: darkMode ? '#fff' : '#1a202c' }}>
              WhatsApp Status: <strong>{user?.whatsappOptIn ? 'Active' : 'Paused'}</strong>
            </span>
          </div>
          <div style={{ fontSize: '13px', color: darkMode ? '#a0aec0' : '#718096' }}>
            <FiClock style={{ marginRight: '6px', display: 'inline' }} />
            Next message: {new Date().getHours() < 9 ? 'Today 9:00 AM' : 'Tomorrow 9:00 AM'}
          </div>
          <div style={{ fontSize: '13px', color: darkMode ? '#a0aec0' : '#718096' }}>
            <BsTrophy style={{ marginRight: '6px', display: 'inline' }} />
            Total messages: {messages.length}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
        }
        
        .spin {
          animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .spinner-large {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        input:focus, select:focus, button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .message-item:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;