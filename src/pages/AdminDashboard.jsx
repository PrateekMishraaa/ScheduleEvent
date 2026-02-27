import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [customMessage, setCustomMessage] = useState('');
  const [targetType, setTargetType] = useState('all');
  const [sending, setSending] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/admin/stats');
      setStats(res.data.stats);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await axios.get(`/admin/students?type=${filterType}&limit=50`);
      setStudents(res.data.students);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/admin/message-logs?limit=100');
      setLogs(res.data.logs);
    } catch (error) {
      toast.error('Failed to load logs');
    }
  };

  const handleSendCustom = async (e) => {
    e.preventDefault();
    if (!customMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setSending(true);
    try {
      const res = await axios.post('/admin/send-custom', {
        message: customMessage,
        institutionType: targetType !== 'all' ? targetType : undefined
      });
      toast.success(res.data.message);
      setCustomMessage('');
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send messages');
    } finally {
      setSending(false);
    }
  };

  const handleToggleStudent = async (studentId, currentStatus) => {
    try {
      await axios.put(`/admin/toggle-student/${studentId}`);
      toast.success(`Student ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchStudents();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    border: 'none',
    background: activeTab === tab ? 'var(--primary)' : 'var(--light-gray)',
    color: activeTab === tab ? 'white' : 'var(--dark)',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s'
  });

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span>🛡️</span>
          Admin Panel
        </div>
        <div className="navbar-user">
          <div className="user-avatar">{getInitials(user?.fullName)}</div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{user?.fullName}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Welcome */}
        <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)' }}>
          <div>
            <h2>Admin Dashboard 🛡️</h2>
            <p>Manage students and WhatsApp activity messages</p>
          </div>
          <div className="welcome-emoji">⚙️</div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="stat-card">
              <div className="stat-icon purple">👥</div>
              <div className="stat-info"><h3>{stats.totalStudents}</h3><p>Total Students</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info"><h3>{stats.activeStudents}</h3><p>Active Students</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">🏫</div>
              <div className="stat-info"><h3>{stats.schoolStudents}</h3><p>School Students</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">🎓</div>
              <div className="stat-info"><h3>{stats.collegeStudents}</h3><p>College Students</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">📨</div>
              <div className="stat-info"><h3>{stats.totalMessages}</h3><p>Total Messages Sent</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">🆕</div>
              <div className="stat-info"><h3>{stats.recentRegistrations}</h3><p>New This Week</p></div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button style={tabStyle('students')} onClick={() => setActiveTab('students')}>👥 Students</button>
          <button style={tabStyle('send')} onClick={() => setActiveTab('send')}>📤 Send Message</button>
          <button style={tabStyle('logs')} onClick={() => setActiveTab('logs')}>📋 Message Logs</button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="card">
            <div className="card-header"><h3>📅 Automated Message Schedule</h3></div>
            <div className="schedule-grid">
              <div className="schedule-item">
                <div className="schedule-icon">📅</div>
                <h4>Weekly Messages</h4>
                <p>Every Monday 9:00 AM IST</p>
                <p style={{ marginTop: 8, color: 'var(--success)', fontWeight: 600 }}>
                  ✅ {stats?.totalMessages || 0} total sent
                </p>
              </div>
              <div className="schedule-item">
                <div className="schedule-icon">🗓️</div>
                <h4>Monthly Messages</h4>
                <p>1st of Month 10:00 AM IST</p>
                <p style={{ marginTop: 8, color: 'var(--info)', fontWeight: 600 }}>
                  📨 {stats?.thisMonthMessages || 0} this month
                </p>
              </div>
              <div className="schedule-item">
                <div className="schedule-icon">🎊</div>
                <h4>Yearly Messages</h4>
                <p>Jan 1st at Midnight IST</p>
                <p style={{ marginTop: 8, color: '#ff9800', fontWeight: 600 }}>Auto-scheduled</p>
              </div>
            </div>

            {stats?.failedMessages > 0 && (
              <div style={{
                marginTop: 20, padding: '14px 16px', background: 'rgba(220,53,69,0.08)',
                borderRadius: 10, color: 'var(--danger)', fontSize: 14
              }}>
                ⚠️ {stats.failedMessages} messages failed to deliver. Check logs for details.
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="card">
            <div className="card-header">
              <h3>👥 Registered Students</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <select
                  value={filterType}
                  onChange={e => { setFilterType(e.target.value); }}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '2px solid var(--light-gray)', fontSize: 13 }}
                >
                  <option value="">All Types</option>
                  <option value="school">School</option>
                  <option value="college">College</option>
                </select>
                <button className="btn btn-secondary btn-sm" onClick={fetchStudents}>🔄 Refresh</button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <input
                type="text"
                placeholder="🔍 Search by name, email, or institution..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {loadingStudents ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>Loading...</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Institution</th>
                      <th>Type</th>
                      <th>Class/Year</th>
                      <th>WhatsApp</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray)' }}>{student.email}</div>
                        </td>
                        <td>{student.institutionName}</td>
                        <td><span className={`badge badge-${student.institutionType}`}>{student.institutionType}</span></td>
                        <td>{student.classYear}</td>
                        <td style={{ fontSize: 13 }}>{student.phone}</td>
                        <td>
                          <span className={`badge ${student.isActive ? 'badge-active' : 'badge-inactive'}`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ fontSize: 13 }}>{formatDate(student.createdAt)}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${student.isActive ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleStudent(student._id, student.isActive)}
                          >
                            {student.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStudents.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>
                    No students found
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Send Custom Message Tab */}
        {activeTab === 'send' && (
          <div className="card">
            <div className="card-header"><h3>📤 Send Custom WhatsApp Message</h3></div>
            <form onSubmit={handleSendCustom}>
              <div className="form-group">
                <label>Target Audience</label>
                <select value={targetType} onChange={e => setTargetType(e.target.value)}>
                  <option value="all">All Students ({stats?.activeStudents || 0} active)</option>
                  <option value="school">School Students Only ({stats?.schoolStudents || 0})</option>
                  <option value="college">College Students Only ({stats?.collegeStudents || 0})</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  placeholder="Type your WhatsApp message here...&#10;&#10;Use {name} to personalize with student's name.&#10;Example: Hello {name}! Great news about your school..."
                  rows={6}
                />
                <p style={{ fontSize: 12, color: 'var(--gray)', marginTop: 6 }}>
                  💡 Use <code>{'{name}'}</code> to personalize with each student's name
                </p>
              </div>

              {customMessage && (
                <div style={{
                  padding: '16px', background: '#f0fff4', borderRadius: 10,
                  border: '2px solid #c6f6d5', marginBottom: 16, fontSize: 14
                }}>
                  <strong>Preview:</strong>
                  <p style={{ marginTop: 8, whiteSpace: 'pre-wrap', color: '#2d6a4f' }}>
                    {customMessage.replace('{name}', 'Rahul Kumar')}
                  </p>
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: 'auto', padding: '12px 32px' }}>
                {sending ? '⏳ Sending...' : '📨 Send to All Selected Students'}
              </button>
            </form>
          </div>
        )}

        {/* Message Logs Tab */}
        {activeTab === 'logs' && (
          <div className="card">
            <div className="card-header">
              <h3>📋 Message Delivery Logs</h3>
              <button className="btn btn-secondary btn-sm" onClick={fetchLogs}>🔄 Refresh</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Institution</th>
                    <th>Type</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log._id}>
                      <td style={{ fontWeight: 600 }}>{log.userId?.fullName || '—'}</td>
                      <td style={{ fontSize: 13 }}>{log.userId?.institutionName || '—'}</td>
                      <td><span className={`message-badge badge-${log.type}`}>{log.type}</span></td>
                      <td style={{ fontSize: 13 }}>{log.phone}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: log.status === 'sent' ? 'rgba(40,167,69,0.12)' : 'rgba(220,53,69,0.12)',
                          color: log.status === 'sent' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {log.status === 'sent' ? '✓ Sent' : '✗ Failed'}
                        </span>
                        {log.errorMessage && (
                          <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>
                            {log.errorMessage.slice(0, 40)}...
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--gray)' }}>
                        {new Date(log.createdAt).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray)' }}>
                  No message logs yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;