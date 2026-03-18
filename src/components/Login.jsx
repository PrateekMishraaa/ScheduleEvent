// 📁 src/pages/Login.jsx (FIXED)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios"
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
console.log('form data',formData)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    
    try {
      // Use the context login function instead of axios directly
      const response = await axios.post('https://scheduleeventbackend.onrender.com/api/auth/login',formData,{
        headers:{
          "Content-Type":"application/json"
        }
      })
      console.log('this is login form data',response.data)
      localStorage.setItem('token',response.data.token)
      await login(formData.email, formData.password);
      
      toast.success('Login successful!');
      
      // Note: Don't navigate here - let the PublicRoute component handle redirection
      // The PublicRoute will automatically redirect based on user role
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '48px' }}>🎓</span>
          <h1 style={{ color: '#2d3748', fontSize: '24px', margin: '10px 0 5px' }}>
            Welcome Back!
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            Login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                ...(loading && { opacity: 0.7 })
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                ...(loading && { opacity: 0.7 })
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              transition: 'transform 0.3s, opacity 0.3s',
              ...(!loading && {
                transform: 'scale(1)',
                ':hover': {
                  transform: 'scale(1.02)',
                  opacity: 0.9
                }
              })
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Demo Credentials */}
     

        </form>

        {/* Register Link */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          fontSize: '14px' 
        }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
            onMouseLeave={(e) => e.target.style.color = '#667eea'}
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;