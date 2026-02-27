// 📁 src/pages/Register.jsx (COMPLETE WITH SCHOOL NAME AND CLASS)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onBlur'
  });

  const phoneNumber = watch('phone');

  // ✅ Class options
  const classOptions = [
    'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
    '1st Year College', '2nd Year College', '3rd Year College', '4th Year College',
    'Postgraduate', 'PhD', 'Diploma', 'Other'
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const registrationData = {
        fullName: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phone: data.phone.trim(),
        schoolName: data.schoolName.trim(),  // ✅ School name
        className: data.className,             // ✅ Class name
        city: data.city?.trim() || ''
      };

      console.log('📤 Sending:', registrationData);
      await registerUser(registrationData);
      
      toast.success(
        <div>
          <div>🎉 Registration successful!</div>
          <small>{data.schoolName} - {data.className}</small>
        </div>,
        { duration: 5000 }
      );
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error:', error);
      
      let errorMsg = 'Registration failed';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMsg = error.response.data.errors[0]?.msg || errorMsg;
      }
      
      toast.error(errorMsg);
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Student Full Name *
            </label>
            <input
              {...register('fullName', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name too short' }
              })}
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
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Email Address *
            </label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              })}
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
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              WhatsApp Number * (with country code)
            </label>
            <input
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^\+[1-9]\d{1,14}$/,
                  message: 'Format: +919876543210'
                }
              })}
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
                {errors.phone.message}
              </p>
            )}
            <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Example: +919876543210 (India), +11234567890 (USA)
            </small>
          </div>

          {/* ✅ SCHOOL NAME - NEW FIELD */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              School / College Name *
            </label>
            <input
              {...register('schoolName', { 
                required: 'School/College name is required',
                minLength: { value: 2, message: 'Enter valid school name' }
              })}
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
                {errors.schoolName.message}
              </p>
            )}
          </div>

          {/* ✅ CLASS - NEW FIELD */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Class / Year *
            </label>
            <select
              {...register('className', { 
                required: 'Please select your class/year'
              })}
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
                {errors.className.message}
              </p>
            )}
          </div>

          {/* City */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              City (Optional)
            </label>
            <input
              {...register('city')}
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
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters required' }
              })}
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
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Preview - Show entered info */}
          {phoneNumber && (
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
                <strong>School:</strong> {watch('schoolName') || '—'}
              </p>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>Class:</strong> {watch('className') || '—'}
              </p>
              <p style={{ fontSize: '13px' }}>
                <strong>WhatsApp:</strong> {phoneNumber}
              </p>
            </div>
          )}

          {/* Sandbox Instructions */}
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