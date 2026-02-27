// 📁 src/pages/TestMessageStatus.jsx (Optional Admin Page)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TestMessages = () => {
  const { axiosInstance } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [phoneData, setPhoneData] = useState({ phone: '', name: '' });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axiosInstance.get('/test/status');
      setStatus(res.data);
    } catch (error) {
      toast.error('Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAll = async () => {
    setSending(true);
    try {
      const res = await axiosInstance.post('/test/send-to-all');
      toast.success(`✅ Sent to ${res.data.result.sent} users`);
      fetchStatus();
    } catch (error) {
      toast.error('Failed to send messages');
    } finally {
      setSending(false);
    }
  };

  const handleSendToPhone = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axiosInstance.post('/test/send-to-phone', phoneData);
      toast.success(`✅ Message sent to ${phoneData.phone}`);
      setPhoneData({ phone: '', name: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-content">
      <h1>📱 Test Message System</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Status</h3>
          <p>{status?.status}</p>
        </div>
        <div className="stat-card">
          <h3>Schedule</h3>
          <p>{status?.cronSchedule}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>{status?.activeUsers}</p>
        </div>
      </div>

      <button 
        onClick={handleSendToAll}
        disabled={sending}
        className="btn btn-primary"
      >
        {sending ? 'Sending...' : '📨 Send to All Users Now'}
      </button>

      <form onSubmit={handleSendToPhone} style={{ marginTop: '20px' }}>
        <h3>Send to Specific Phone</h3>
        <input
          type="tel"
          placeholder="Phone (+919876543210)"
          value={phoneData.phone}
          onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={phoneData.name}
          onChange={(e) => setPhoneData({ ...phoneData, name: e.target.value })}
        />
        <button type="submit" disabled={sending} className="btn btn-secondary">
          Send
        </button>
      </form>

      <h3>Recent Messages</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Phone</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {status?.recentMessages?.map(msg => (
            <tr key={msg._id}>
              <td>{msg.userId?.fullName}</td>
              <td>{msg.phone}</td>
              <td>{new Date(msg.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestMessages