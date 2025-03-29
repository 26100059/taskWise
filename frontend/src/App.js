import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import MainPage from "./pages/mainPage";
import SignUpPage from "./pages/signUp";
import SignInPage from "./pages/signIn";
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/profilePage";
import TestingDB from "./pages/TestingDB";


console.log("🔹 App.js is being loaded!");

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (user === null) {
    console.log("🔴 No user found, redirecting to Sign In...");
    return <Navigate to="/signin" replace />;
  }

  return children;
};


function App() {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("📂 LocalStorage User:", storedUser ? JSON.parse(storedUser) : "No user found");
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/testingDB" element={<ProtectedRoute><TestingDB /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
