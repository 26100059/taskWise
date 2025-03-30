// // // src/pages/SignInPage.js
// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import "../styles/signInPage.css"; // Updated CSS for Sign In page

// // // Import the brand image (same as used in the Sign Up page)
// // import brandImage from '../assets/brandname.png';

// // const API_BASE = 'http://localhost:7000/token';

// // const SignInPage = () => {
// //   const navigate = useNavigate();
// //   const [formData, setFormData] = useState({ email: '', password: '' });
// //   const [errorMessage, setErrorMessage] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setErrorMessage('');
// //     setSuccessMessage('');

// //     try {
// //       const response = await fetch(`${API_BASE}/userslogin`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(formData),
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         localStorage.setItem('token', data.token); // Store token
// //         setSuccessMessage('Login successful! Redirecting...');
// //         setTimeout(() => navigate('/dashboard'), 500);
// //       } else {
// //         setErrorMessage(data.error || 'Failed to log in. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('Error:', error);
// //       setErrorMessage('An unexpected error occurred. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="signIn-container">
// //       <div className="signIn-main-content">
// //         {/* Left Section: Branding */}
// //         <div className="signIn-left-section">
// //           <img src={brandImage} alt="Brand Name and Tagline" className="signIn-brand-image" />
// //         </div>

// //         {/* Right Section: Sign In Form */}
// //         <div className="signIn-right-section">
// //           <div className="signIn-form-container">
// //             <h2 className="signIn-form-title">SIGN IN</h2>
// //             <p className="signUp-signin-prompt">
// //               Don't have an account? <a href="/signup">Sign Up</a>
// //             </p>
// //             {errorMessage && <p className="signIn-error">{errorMessage}</p>}
// //             {successMessage && <p className="signIn-success">{successMessage}</p>}
// //             <form onSubmit={handleSubmit}>
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

// //               <button type="submit" id="signInBtn">
// //                 SIGN IN <span className="signIn-arrow">→</span>
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Footer */}
// //       <footer className="signIn-footer">
// //         <p className="signIn-copyright">
// //           TASK WISE © 2025. ALL RIGHTS RESERVED
// //         </p>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default SignInPage;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, selectAuthStatus, selectAuthError, selectAuthToken } from '../redux/slices/authSlice';
// import "../styles/signInPage.css";
// import brandImage from '../assets/brandname.png';

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const status = useSelector(selectAuthStatus);
//   const error = useSelector(selectAuthError);
//   const token = useSelector(selectAuthToken);
//   const [formData, setFormData] = useState({ 
//     email: '', 
//     password: '' 
//   });

//   // Debugging effect
//   useEffect(() => {
//     console.log('[SignIn] Current auth status:', status);
//     console.log('[SignIn] Stored token:', token);
//   }, [status, token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

// // In your handleSubmit function
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('[SignIn] Form submitted:', formData);
    
//     dispatch(loginUser(formData))
//       .unwrap()
//       .then(() => {
//         navigate('/dashboard');
//       })
//       .catch((error) => {
//         console.error('[SignIn] Login failed:', error);
//         // Add visual feedback for different error types
//         if (error.includes('ECONNREFUSED') || error.includes('Network Error')) {
//           alert('Backend server is unavailable. Please try again later.');
//         }
//       });
//   };


//   return (
//     <div className="signIn-container">
//       <div className="signIn-main-content">
//         <div className="signIn-left-section">
//           <img src={brandImage} alt="Brand Name and Tagline" className="signIn-brand-image" />
//         </div>

//         <div className="signIn-right-section">
//           <div className="signIn-form-container">
//             <h2 className="signIn-form-title">SIGN IN</h2>
//             <p className="signUp-signin-prompt">
//               Don't have an account? <a href="/signup">Sign Up</a>
//             </p>
            
//             {error && <p className="signIn-error">{error}</p>}
//             {status === 'loading' && <p className="signIn-loading">Authenticating...</p>}

//             <form onSubmit={handleSubmit}>
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

//               <button 
//                 type="submit" 
//                 id="signInBtn"
//                 disabled={status === 'loading'}
//               >
//                 {status === 'loading' ? 'Processing...' : 'SIGN IN '}
//                 {status !== 'loading' && <span className="signIn-arrow">→</span>}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       <footer className="signIn-footer">
//         <p className="signIn-copyright">
//           TASK WISE © 2025. ALL RIGHTS RESERVED
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default SignInPage;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthStatus, selectAuthError, selectAuthToken } from '../redux/slices/authSlice';
import "../styles/signInPage.css";
import brandImage from '../assets/brandname.png';

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const token = useSelector(selectAuthToken);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });

  // Debugging effect
  useEffect(() => {
    console.log('[SignIn] Current auth status:', status);
    console.log('[SignIn] Stored token:', token);
  }, [status, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[SignIn] Form submitted:', formData);
    
    dispatch(loginUser(formData))
      .unwrap()
      .then((response) => {
        console.log('[SignIn] Login successful, response:', response);
        console.log('[SignIn] Redirecting to dashboard...');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('[SignIn] Login failed:', error);
      });
  };

  return (
    <div className="signIn-container">
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
            
            {error && <p className="signIn-error">{error}</p>}
            {status === 'loading' && <p className="signIn-loading">Authenticating...</p>}

            <form onSubmit={handleSubmit} autoComplete="on"> {/* Add autoComplete attribute here */}
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
                autoComplete="current-password" // Add autoComplete for password
              />

              <button 
                type="submit" 
                id="signInBtn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Processing...' : 'SIGN IN '}
                {status !== 'loading' && <span className="signIn-arrow">→</span>}
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
