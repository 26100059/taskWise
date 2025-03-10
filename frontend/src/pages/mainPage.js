import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mainPage.css'; // Link the stylesheet

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h1 className="main-title">Welcome to Task Wise</h1>
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
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn dashboard-btn"
        >
          Dashboard
        </button>
        <button 
          onClick={() => navigate('/testingDB')}
          className="btn testing-btn"
        >
          Test DB
        </button>
      </div>
    </div>
  );
};

export default MainPage;
