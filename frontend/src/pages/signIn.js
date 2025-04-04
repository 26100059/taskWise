// src/pages/SignInPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import "../styles/signInPage.css";
import brandImage from '../assets/brandname.png';


const API_BASE = process.env.REACT_APP_API_BASE_URL

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Notification state: { type: 'success' | 'failure', message: string }
  const [notification, setNotification] = useState(null);

  // Function to display notification for 2 seconds with a custom message and type
  const showNotification = (message, type) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/testingDB/userslogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(loginSuccess({
          userId: data.userId,
          token: data.token,
          name: data.name  // ✅ Pass 'name' from backend response
        })); // Store in Redux
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        showNotification(data.error || 'Failed to log in. Please try again.', 'failure');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('An unexpected error occurred. Please try again.', 'failure');
    }
  };

  return (
    <div className="signIn-container">
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

      <div className="signIn-main-content">
        <div className="signIn-left-section">
          <img src={brandImage} alt="Brand Name and Tagline" className="signIn-brand-image" />
        </div>

        <div className="signIn-right-section">
          <div className="signIn-form-container">
            <h2 className="signIn-form-title">SIGN IN</h2>
            <p className="signUp-signin-prompt">
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
            <form onSubmit={handleSubmit}>
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

              <button type="submit" id="signInBtn">
                SIGN IN <span className="signIn-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="signIn-footer">
        <p className="signIn-copyright">
          TASK WISE © 2025. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default SignInPage;
