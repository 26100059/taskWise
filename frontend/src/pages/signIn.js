// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://localhost:7000/testingDB';

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setErrorMessage(''); // Clear previous errors
//   //   setSuccessMessage(''); // Clear previous success message
//   //   try {
//   //     const response = await fetch(`${API_BASE}/userslogin`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(formData),
//   //     });

//   //     const data = await response.json();
//   //     if (response.ok) {
//   //       setSuccessMessage('Login successful! Redirecting...');
//   //       setTimeout(() => navigate('/dashboard'), 500);
//   //     } else {
//   //       setErrorMessage(data.error || 'Failed to log in. Please try again.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error:', error);
//   //     setErrorMessage('An unexpected error occurred. Please try again.');
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');
  
//     try {
//       const response = await fetch(`${API_BASE}/userslogin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token); // Store token
//         setSuccessMessage('Login successful! Redirecting...');
//         setTimeout(() => navigate('/dashboard'), 500);
//       } else {
//         setErrorMessage(data.error || 'Failed to log in. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An unexpected error occurred. Please try again.');
//     }
//   };
  

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-6">Sign In</h1>
//       {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
//       {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>}
//       <form className="w-80 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <input 
//             type="email" 
//             name="email"
//             placeholder="Email" 
//             className="w-full px-3 py-2 border rounded"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <input 
//             type="password" 
//             name="password"
//             placeholder="Password" 
//             className="w-full px-3 py-2 border rounded"
//             value={formData.password}
//             onChange={handleChange}
//             required
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


















// // src/pages/SignInPage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/signInPage.css"; // Using our updated sign-in CSS

// // Import the brand image (same as used in Sign Up / Main Page)
// import brandImage from '../assets/brandname.png';

// const API_BASE = 'http://localhost:7000/testingDB';

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const response = await fetch(`${API_BASE}/userslogin`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token); // Store token
//         setSuccessMessage('Login successful! Redirecting...');
//         setTimeout(() => navigate('/dashboard'), 500);
//       } else {
//         setErrorMessage(data.error || 'Failed to log in. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="signIn-container">
//       <div className="signIn-main-content">
//         {/* Left Section: Branding */}
//         <div className="signIn-left-section">
//           <img src={brandImage} alt="Brand Name and Tagline" className="signIn-brand-image" />
//         </div>
        
//         {/* Right Section: Sign In Form */}
//         <div className="signIn-right-section">
//           <div className="signIn-form-container">
//             <h2 className="signIn-form-title">SIGN IN</h2>
//             {errorMessage && <p className="signIn-error">{errorMessage}</p>}
//             {successMessage && <p className="signIn-success">{successMessage}</p>}
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
  
//               <button type="submit" id="signInBtn">
//                 LOG IN <span className="signIn-arrow">→</span>
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
  
//       {/* Footer */}
//       <footer className="signIn-footer">
//         <p className="signIn-copyright">
//           TASK WISE © 2025. ALL RIGHTS RESERVED
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default SignInPage;











// // src/pages/SignInPage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/signInPage.css"; // Import the Sign In page styles
// import brandImage from '../assets/brandname.png'; // Import branding image

// const API_BASE = 'http://localhost:7000/testingDB';

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const response = await fetch(`${API_BASE}/userslogin`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token); // Store token
//         setSuccessMessage('Login successful! Redirecting...');
//         setTimeout(() => navigate('/dashboard'), 500);
//       } else {
//         setErrorMessage(data.error || 'Failed to log in. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="signIn-container">
//       <div className="signIn-main-content">
//         {/* Left Section: Branding */}
//         <div className="signIn-left-section">
//           <img src={brandImage} alt="Brand Name and Tagline" className="signIn-brand-image" />
//         </div>
        
//         {/* Right Section: Sign In Form */}
//         <div className="signIn-right-section">
//           <div className="signIn-form-container">
//             <h2 className="signIn-form-title">SIGN IN</h2>

//             {/* Sign Up Redirection */}
//             <p className="signIn-switch-text">
//               Don’t have an account? 
//               <button onClick={() => navigate('/signup')} className="signIn-switch-btn">Sign Up</button>
//             </p>

//             {errorMessage && <p className="signIn-error">{errorMessage}</p>}
//             {successMessage && <p className="signIn-success">{successMessage}</p>}

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
  
//               <button type="submit" id="signInBtn">
//                 LOG IN <span className="signIn-arrow">→</span>
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
  
//       {/* Footer */}
//       <footer className="signIn-footer">
//         <p className="signIn-copyright">
//           TASK WISE © 2025. ALL RIGHTS RESERVED
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default SignInPage;









// // src/pages/SignInPage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/signInPage.css"; // Updated CSS for Sign In page

// // Import the brand image (same as used in the Sign Up page)
// import brandImage from '../assets/brandname.png';

// const API_BASE = 'http://localhost:7000/testingDB';

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const response = await fetch(`${API_BASE}/userslogin`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token); // Store token
//         setSuccessMessage('Login successful! Redirecting...');
//         setTimeout(() => navigate('/dashboard'), 500);
//       } else {
//         setErrorMessage(data.error || 'Failed to log in. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="signIn-container">
//       <div className="signIn-main-content">
//         {/* Left Section: Branding */}
//         <div className="signIn-left-section">
//           <img src={brandImage} alt="Brand Name and Tagline" className="signIn-brand-image" />
//         </div>
        
//         {/* Right Section: Sign In Form */}
//         <div className="signIn-right-section">
//           <div className="signIn-form-container">
//             <h2 className="signIn-form-title">SIGN IN</h2>
//             <p className="signIn-switch-text">
//               Don’t have an account?
//               <button onClick={() => navigate('/signup')} className="signIn-switch-btn"> Sign Up</button>
//             </p>
//             {errorMessage && <p className="signIn-error">{errorMessage}</p>}
//             {successMessage && <p className="signIn-success">{successMessage}</p>}
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
  
//               <button type="submit" id="signInBtn">
//                 SIGN IN <span className="signIn-arrow">→</span>
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
  
//       {/* Footer */}
//       <footer className="signIn-footer">
//         <p className="signIn-copyright">
//           TASK WISE © 2025. ALL RIGHTS RESERVED
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default SignInPage;










// src/pages/SignInPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/signInPage.css"; // Updated CSS for Sign In page

// Import the brand image (same as used in the Sign Up page)
import brandImage from '../assets/brandname.png';

const API_BASE = 'http://localhost:7000/testingDB';

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE}/userslogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setErrorMessage(data.error || 'Failed to log in. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="signIn-container">
      <div className="signIn-main-content">
        {/* Left Section: Branding */}
        <div className="signIn-left-section">
          <img src={brandImage} alt="Brand Name and Tagline" className="signIn-brand-image" />
        </div>
        
        {/* Right Section: Sign In Form */}
        <div className="signIn-right-section">
          <div className="signIn-form-container">
            <h2 className="signIn-form-title">SIGN IN</h2>
            <p className="signUp-signin-prompt">
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
            {errorMessage && <p className="signIn-error">{errorMessage}</p>}
            {successMessage && <p className="signIn-success">{successMessage}</p>}
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
  
      {/* Footer */}
      <footer className="signIn-footer">
        <p className="signIn-copyright">
          TASK WISE © 2025. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default SignInPage;
