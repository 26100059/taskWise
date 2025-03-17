import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mainPage.css';

// Import images
import logoImage from '../assets/logo.png';
import calendarImage from '../assets/calendar.png';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="task-wise-container">
      <div className="content-container">
        <div className="main-content">
          {/* Left Section: Calendar Image */}
          <div className="left-section">
            <img src={calendarImage} alt="Calendar" className="calendar-image" />
          </div>

          {/* Right Section: Branding & Buttons */}
          <div className="right-section">
            <div className="header">
              <div className="logo-box">
                <img src={logoImage} alt="Logo" className="logo-image" />
              </div>
              <h1 className="brand-name">TASKWISE</h1>
            </div>
            <p className="tagline">Smarter Scheduling, Better Productivity.</p>
            <div className="button-group">
              <button 
                onClick={() => navigate('/signup')}
                className="btn signup-btn"
              >
                Sign Up
              </button>
              <button 
                onClick={() => navigate('/signin')}
                className="btn signin-btn"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <p className="copyright">
          TASK WISE © 2025. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default MainPage;
