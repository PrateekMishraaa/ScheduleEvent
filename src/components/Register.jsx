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
  } = useForm();
console.log("thsi is register data",register)
  const institutionType = watch('institutionType');

  const classOptions = {
    school: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    college: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD']
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('🎉 Registration successful! Check WhatsApp for welcome message!');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 
                  error.response?.data?.errors?.[0]?.msg ||
                  'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🎓</span>
          <h1>Student Activity Platform</h1>
          <p>Register to get weekly activity updates on WhatsApp!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              type="text"
              placeholder="Rahul Kumar"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <p className="error-msg">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address *</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
              })}
              type="email"
              placeholder="rahul@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <p className="error-msg">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>WhatsApp Number * (with country code)</label>
            <input
              {...register('phone', {
                required: 'WhatsApp number is required',
                pattern: {
                  value: /^\+[1-9]\d{9,14}$/,
                  message: 'Format: +919876543210 (include country code)'
                }
              })}
              type="tel"
              placeholder="+919876543210"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
          </div>

          {/* Institution Type + Name */}
          <div className="form-row">
            <div className="form-group">
              <label>Institution Type *</label>
              <select
                {...register('institutionType', { required: 'Select type' })}
                className={errors.institutionType ? 'error' : ''}
              >
                <option value="">Select...</option>
                <option value="school">School</option>
                <option value="college">College</option>
              </select>
              {errors.institutionType && <p className="error-msg">{errors.institutionType.message}</p>}
            </div>

            <div className="form-group">
              <label>Class / Year *</label>
              <select
                {...register('classYear', { required: 'Select class/year' })}
                className={errors.classYear ? 'error' : ''}
                disabled={!institutionType}
              >
                <option value="">Select...</option>
                {institutionType && classOptions[institutionType]?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.classYear && <p className="error-msg">{errors.classYear.message}</p>}
            </div>
          </div>

          {/* School/College Name */}
          <div className="form-group">
            <label>School / College Name *</label>
            <input
              {...register('institutionName', { required: 'Institution name is required' })}
              type="text"
              placeholder="e.g. Delhi Public School"
              className={errors.institutionName ? 'error' : ''}
            />
            {errors.institutionName && <p className="error-msg">{errors.institutionName.message}</p>}
          </div>

          {/* City */}
          <div className="form-group">
            <label>City</label>
            <input
              {...register('city')}
              type="text"
              placeholder="e.g. Delhi"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password *</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              type="password"
              placeholder="Min 6 characters"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Registering...' : '🚀 Register & Join'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;