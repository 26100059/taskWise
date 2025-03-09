import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './pages/mainPage';
import SignUpPage from './pages/signUp';
import SignInPage from './pages/signIn';
import DashboardPage from './pages/dashboard';
import ProfilePage from './pages/profilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
