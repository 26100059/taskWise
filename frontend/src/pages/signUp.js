// File: src/pages/SignUp.js
import React, { useState } from "react";
import "../styles/signUpPage.css"; // Import the CSS for this page

function SignUp() {
  // Local state for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Example sign-up logic
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);

    alert("Sign up successful!");
    // You could redirect the user or call an API here
  };

  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo-wrapper">
          {/* Replace this with an actual <img> if you have a logo */}
          <img
            src="/taskwisee.png" 
            alt="Taskwise Logo"
            className="logo-image"
          />
          {/* <h1 className="logo-text">TASKWISE</h1> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="form-wrapper">
          <h2 className="form-title">SIGN UP</h2>
          <p className="signin-prompt">
            Already have an account? <a href="/signin">Sign In</a>
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="JohnDoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" id="signUpBtn">
              SIGN UP <span className="arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
