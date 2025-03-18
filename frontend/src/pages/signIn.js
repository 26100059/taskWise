// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const SignInPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-6">Sign In</h1>
//       <form className="w-80 bg-white p-6 rounded shadow">
//         <div className="mb-4">
//           <input 
//             type="email" 
//             placeholder="Email" 
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div className="mb-4">
//           <input 
//             type="password" 
//             placeholder="Password" 
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <button type="submit" className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
//           Log In
//         </button>
//       </form>
//       <button 
//         onClick={() => navigate('/')}
//         className="mt-4 text-blue-500 hover:underline"
//       >
//         Back to Home
//       </button>
//     </div>
//   );
// };

// export default SignInPage;
// File: src/pages/signIn.js
import React, { useState } from "react";
import "../styles/signInPage.css"; // Import the CSS for this page

function SignIn() {
  // Local state for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in both Email and Password.");
      return;
    }

    // Example sign-in logic
    console.log("Email:", email);
    console.log("Password:", password);

    alert("Sign in successful!");
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
          <h2 className="form-title">SIGN IN</h2>
          <p className="signup-prompt">
            Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </p>

          <form onSubmit={handleSubmit}>
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

            <button type="submit" id="signInBtn">
              SIGN IN <span className="arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
