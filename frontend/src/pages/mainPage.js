// src/pages/MainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mainPage.css';

// Import images
import logoImage from '../assets/logo.png';
import calendarImage from '../assets/calendar.png';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div class="main-wrapper">
      <div className="mainPage-container">
        <div className="mainPage-content-container">
          <div className="mainPage-main-content">
            {/* Left Section: Calendar Image */}
            <div className="mainPage-left-section">
              <img src={calendarImage} alt="Calendar" className="mainPage-calendar-image" />
            </div>

            {/* Right Section: Branding & Buttons */}
            <div className="mainPage-right-section">
              <div className="mainPage-header">
                <div className="mainPage-logo-box">
                  <img src={logoImage} alt="Logo" className="mainPage-logo-image" />
                </div>
                <h1 className="mainPage-brand-name">TASKWISE</h1>
              </div>
              <p className="mainPage-tagline">Smarter Scheduling, Better Productivity.</p>
              <div className="mainPage-button-group">
                <button
                  onClick={() => navigate('/signup')}
                  className="mainPage-btn mainPage-signup-btn"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate('/signin')}
                  className="mainPage-btn mainPage-signin-btn"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mainPage-footer">
          <p className="mainPage-copyright">
            TASK WISE © 2025. ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;
