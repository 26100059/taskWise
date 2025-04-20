import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/signUpPage.css";

import brandImage from '../assets/brandname.png';

const API_BASE = process.env.REACT_APP_API_BASE_URL

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      showNotification("Please fill out all fields.", 'failure');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match. Please try again.", 'failure');
      return;
    }

    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch(`${API_BASE}/testingDB/usersregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showNotification('User registered successfully!', 'success');
        navigate('/');
      } else {
        const data = await response.json();
        if (data.error) {
          showNotification(data.error, 'failure');
        } else {
          showNotification('Failed to register user. Please try again.', 'failure');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        showNotification('Unable to connect to the server. Please check your internet connection or try again later.', 'failure');
      } else {
        showNotification('An unexpected error occurred. Please try again.', 'failure');
      }
    }
  };

  return (
    <div className="signUp-container">
      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: notification.type === 'success' ? 'green' : 'red',
            color: '#fff',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          {notification.message}
        </div>
      )}

      <div className="signUp-main-content">
        {/* Left Section: Brand Image */}
        <div className="signUp-left-section">
          <img src={brandImage} alt="Brand Name and Tagline" className="signUp-brand-image" />
        </div>

        {/* Right Section: Registration Form */}
        <div className="signUp-right-section">
          <div className="signUp-form-container">
            <h2 className="signUp-form-title">SIGN UP</h2>
            <p className="signUp-signin-prompt">
              Already have an account? <a href="/signin">Sign In</a>
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="JohnDoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button type="submit" id="signUpBtn">
                SIGN UP <span className="signUp-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="signUp-footer">
        <p className="signUp-copyright">
          TASK WISE © 2025. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default SignUpPage;
