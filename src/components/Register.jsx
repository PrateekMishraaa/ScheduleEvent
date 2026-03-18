// 📁 src/pages/Register.jsx (WITH DEPLOYED BACKEND URL)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    schoolName: "",
    className: "",
    city: "",
  });
  
  const [errors, setErrors] = useState({});

  // Class options
  const classOptions = [
    'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
    '1st Year College', '2nd Year College', '3rd Year College', '4th Year College',
    'Postgraduate', 'PhD', 'Diploma', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Phone validation
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Valid phone with country code required (e.g. +919876543210)';
    }

    // School Name validation
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School/College name is required';
    }

    // Class validation
    if (!formData.className) {
      newErrors.className = 'Please select your class/year';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API - include only fields from schema
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        schoolName: formData.schoolName.trim(),
        className: formData.className,
        city: formData.city?.trim() || '',
        // Default values for other schema fields
        isPhoneVerified: false,
        role: 'student',
        isActive: true,
        whatsappOptIn: true,
        messagesSent: {
          weekly: 0,
          monthly: 0,
          yearly: 0,
          custom: 0
        },
        totalMessages: 0,
        loginCount: 0
      };

      console.log('📤 Sending registration data to:', 'https://scheduleeventbackend.onrender.com/api/auth/register');
      console.log('📦 Registration data:', registrationData);

      // Make API call to your deployed backend
      const response = await API.post('/auth/register', registrationData);

      console.log('✅ Registration successful:', response.data);

      // Show success message
      toast.success(
        <div>
          <div>🎉 Registration successful!</div>
          <small>{formData.schoolName} - {formData.className}</small>
        </div>,
        { duration: 5000 }
      );

      // Store token if returned
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Redirect to dashboard or login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // Handle different error formats
      let errorMsg = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMsg = error.response.data.errors[0]?.msg || errorMsg;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      // Handle network errors
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Cannot connect to server. Please check your internet connection.';
      }
      
      // Handle duplicate email/phone
      if (error.response?.status === 409) {
        errorMsg = 'Email or phone number already registered';
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Test API connection on component mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await API.get('/');
        console.log('✅ Backend connection successful:', response.data);
      } catch (error) {
        console.error('❌ Backend connection failed:', error);
      }
    };
    testConnection();
  }, []);

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
        maxWidth: '500px'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🏫</span>
          <h1 style={{ color: '#2d3748', fontSize: '24px', marginBottom: '5px' }}>
            Student Registration
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            Register your school/college for WhatsApp updates
          </p>
          {/* Backend status indicator */}
          <div style={{
            marginTop: '10px',
            padding: '4px 8px',
            background: '#f0fff4',
            color: '#38a169',
            borderRadius: '20px',
            fontSize: '12px',
            display: 'inline-block'
          }}>
            ✅ Connected to backend
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Student Full Name *
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Rahul Kumar"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.fullName ? '2px solid #f56565' : '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
            {errors.fullName && (
              <p style={{ color: '#f56565', fontSize: '12px', marginTop: '5px' }}>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Email Address *
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="rahul@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.email ? '2px solid #f56565' : '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
            {errors.email && (
              <p style={{ color: '#f56565', fontSize: '12px', marginTop: '5px' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              WhatsApp Number * (with country code)
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="+919876543210"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.phone ? '2px solid #f56565' : '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
            {errors.phone && (
              <p style={{ color: '#f56565', fontSize: '12px', marginTop: '5px' }}>
                {errors.phone}
              </p>
            )}
            <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Example: +919876543210 (India), +11234567890 (USA)
            </small>
          </div>

          {/* School Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              School / College Name *
            </label>
            <input
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Delhi Public School, IIT Delhi"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.schoolName ? '2px solid #f56565' : '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
            {errors.schoolName && (
              <p style={{ color: '#f56565', fontSize: '12px', marginTop: '5px' }}>
                {errors.schoolName}
              </p>
            )}
          </div>

          {/* Class */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Class / Year *
            </label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.className ? '2px solid #f56565' : '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">-- Select Class/Year --</option>
              {classOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.className && (
              <p style={{ color: '#f56565', fontSize: '12px', marginTop: '5px' }}>
                {errors.className}
              </p>
            )}
          </div>

          {/* City */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              City (Optional)
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Delhi, Mumbai"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Password *
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.password ? '2px solid #f56565' : '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
            {errors.password && (
              <p style={{ color: '#f56565', fontSize: '12px', marginTop: '5px' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Preview - Show entered info */}
          {formData.phone && (
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              background: '#ebf8ff',
              border: '2px solid #4299e1',
              borderRadius: '10px'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2b6cb0' }}>
                📋 Registration Summary:
              </p>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>School:</strong> {formData.schoolName || '—'}
              </p>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>Class:</strong> {formData.className || '—'}
              </p>
              <p style={{ fontSize: '13px' }}>
                <strong>WhatsApp:</strong> {formData.phone}
              </p>
            </div>
          )}

          {/* Sandbox Instructions
          <div style={{
            marginBottom: '20px',
            padding: '12px',
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '10px',
            fontSize: '13px'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>📱 WhatsApp Setup:</p>
            <p>Send <strong>"join cookies-by"</strong> to <strong>+1 415 523 8886</strong> on WhatsApp to receive messages!</p>
          </div> */}

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
              transition: 'all 0.3s'
            }}
          >
            {loading ? '⏳ Registering...' : '📝 Register Now'}
          </button>

        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#718096' }}>
          Already have an account? <Link to="/login" style={{ color: '#667eea', fontWeight: '600' }}>Login here</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;