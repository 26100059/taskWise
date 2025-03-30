// // // src/pages/SignUpPage.js
// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import "../styles/signUpPage.css"; // Using our updated sign-up CSS

// // // Import the brand image (which includes the brand name and tagline)
// // import brandImage from '../assets/brandname.png';

// // const API_BASE = 'http://localhost:7000/token';

// // const SignUpPage = () => {
// //   const navigate = useNavigate();
  
// //   // Combined form state
// //   const [formData, setFormData] = useState({
// //     fullName: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: ''
// //   });
  
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };
  
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     // Basic validation
// //     if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
// //       alert("Please fill out all fields.");
// //       return;
// //     }
    
// //     if (formData.password !== formData.confirmPassword) {
// //       alert("Passwords do not match. Please try again.");
// //       return;
// //     }
    
// //     // Prepare payload (mapping fullName to name)
// //     const payload = {
// //       name: formData.fullName,
// //       email: formData.email,
// //       password: formData.password
// //     };
    
// //     try {
// //       const response = await fetch(`${API_BASE}/usersregister`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload),
// //       });
  
// //       if (response.ok) {
// //         alert('User registered successfully!');
// //         navigate('/');
// //       } else {
// //         const data = await response.json();
// //         if (data.error) {
// //           alert(data.error);
// //         } else {
// //           alert('Failed to register user. Please try again.');
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error:', error);
// //       if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
// //         alert('Unable to connect to the server. Please check your internet connection or try again later.');
// //       } else {
// //         alert('An unexpected error occurred. Please try again.');
// //       }
// //     }
// //   };
  
// //   return (
// //     <div className="signUp-container">
// //       <div className="signUp-main-content">
// //         {/* Left Section: Brand Image */}
// //         <div className="signUp-left-section">
// //           <img src={brandImage} alt="Brand Name and Tagline" className="signUp-brand-image" />
// //         </div>
        
// //         {/* Right Section: Registration Form */}
// //         <div className="signUp-right-section">
// //           <div className="signUp-form-container">
// //             <h2 className="signUp-form-title">SIGN UP</h2>
// //             <p className="signUp-signin-prompt">
// //               Already have an account? <a href="/signin">Sign In</a>
// //             </p>
// //             <form onSubmit={handleSubmit}>
// //               <label htmlFor="fullName">Full Name</label>
// //               <input
// //                 type="text"
// //                 id="fullName"
// //                 name="fullName"
// //                 placeholder="John Doe"
// //                 value={formData.fullName}
// //                 onChange={handleChange}
// //                 required
// //               />
  
// //               <label htmlFor="email">Email Address</label>
// //               <input
// //                 type="email"
// //                 id="email"
// //                 name="email"
// //                 placeholder="JohnDoe@gmail.com"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 required
// //               />
  
// //               <label htmlFor="password">Password</label>
// //               <input
// //                 type="password"
// //                 id="password"
// //                 name="password"
// //                 placeholder="••••••••"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 required
// //               />
  
// //               <label htmlFor="confirmPassword">Confirm Password</label>
// //               <input
// //                 type="password"
// //                 id="confirmPassword"
// //                 name="confirmPassword"
// //                 placeholder="••••••••"
// //                 value={formData.confirmPassword}
// //                 onChange={handleChange}
// //                 required
// //               />
  
// //               <button type="submit" id="signUpBtn">
// //                 SIGN UP <span className="signUp-arrow">→</span>
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
      
// //       {/* Footer */}
// //       <footer className="signUp-footer">
// //         <p className="signUp-copyright">
// //           TASK WISE © 2025. ALL RIGHTS RESERVED
// //         </p>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default SignUpPage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser, selectAuthStatus, selectAuthError } from '../redux/slices/authSlice';
// import "../styles/signUpPage.css";
// import brandImage from '../assets/brandname.png';

// const SignUpPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const status = useSelector(selectAuthStatus);
//   const error = useSelector(selectAuthError);
//   const [formData, setFormData] = useState({ 
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match. Please try again.");
//       return;
//     }
    
//     const payload = {
//       name: formData.fullName,
//       email: formData.email,
//       password: formData.password
//     };
    
//     dispatch(registerUser(payload))
//       .unwrap()
//       .then(() => {
//         alert('Registration successful! Please sign in.');
//         navigate('/signin');
//       })
//       .catch(() => {});
//   };

//   return (
//     <div className="signUp-container">
//       <div className="signUp-main-content">
//         <div className="signUp-left-section">
//           <img src={brandImage} alt="Brand Name and Tagline" className="signUp-brand-image" />
//         </div>
        
//         <div className="signUp-right-section">
//           <div className="signUp-form-container">
//             <h2 className="signUp-form-title">SIGN UP</h2>
//             <p className="signUp-signin-prompt">
//               Already have an account? <a href="/signin">Sign In</a>
//             </p>
            
//             {error && <p className="signUp-error">{error}</p>}
//             {status === 'loading' && <p className="signUp-loading">Creating account...</p>}

//             <form onSubmit={handleSubmit}>
//               <label htmlFor="fullName">Full Name</label>
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 placeholder="John Doe"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 required
//               />

//               <label htmlFor="email">Email Address</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="JohnDoe@gmail.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />

//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />

//               <label htmlFor="confirmPassword">Confirm Password</label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 placeholder="••••••••"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//               />

//               <button 
//                 type="submit" 
//                 id="signUpBtn"
//                 disabled={status === 'loading'}
//               >
//                 {status === 'loading' ? 'Processing...' : 'SIGN UP '}
//                 {status !== 'loading' && <span className="signUp-arrow">→</span>}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
      
//       <footer className="signUp-footer">
//         <p className="signUp-copyright">
//           TASK WISE © 2025. ALL RIGHTS RESERVED
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default SignUpPage;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthStatus, selectAuthError } from '../redux/slices/authSlice';
import "../styles/signUpPage.css";
import brandImage from '../assets/brandname.png';

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const [formData, setFormData] = useState({ 
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Debugging effect
  useEffect(() => {
    console.log('[SignUp] Current auth status:', status);
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[SignUp] Form submitted:', formData);
    
    if (formData.password !== formData.confirmPassword) {
      console.warn('[SignUp] Password mismatch');
      alert("Passwords do not match. Please try again.");
      return;
    }
    
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password
    };
    
    dispatch(registerUser(payload))
      .unwrap()
      .then((response) => {
        console.log('[SignUp] Registration successful, response:', response);
        alert('Registration successful! Please sign in.');
        navigate('/signin');
      })
      .catch((error) => {
        console.error('[SignUp] Registration failed:', error);
      });
  };

  return (
    <div className="signUp-container">
      <div className="signUp-main-content">
        <div className="signUp-left-section">
          <img src={brandImage} alt="Brand Name and Tagline" className="signUp-brand-image" />
        </div>
        
        <div className="signUp-right-section">
          <div className="signUp-form-container">
            <h2 className="signUp-form-title">SIGN UP</h2>
            <p className="signUp-signin-prompt">
              Already have an account? <a href="/signin">Sign In</a>
            </p>
            
            {error && <p className="signUp-error">{error}</p>}
            {status === 'loading' && <p className="signUp-loading">Creating account...</p>}

            <form onSubmit={handleSubmit} autoComplete="on"> {/* Add autoComplete attribute here */}
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                autoComplete="name" // Add autoComplete for full name
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
                autoComplete="email" // Add autoComplete for email
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
                autoComplete="new-password" // Add autoComplete for password
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
                autoComplete="new-password" // Add autoComplete for confirm password
              />

              <button 
                type="submit" 
                id="signUpBtn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Processing...' : 'SIGN UP '}
                {status !== 'loading' && <span className="signUp-arrow">→</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <footer className="signUp-footer">
        <p className="signUp-copyright">
          TASK WISE © 2025. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default SignUpPage;
