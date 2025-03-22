// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://localhost:7000/testingDB'

// const SignUpPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch (`${API_BASE}/usersregister`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
  
//       if (response.ok) {
//         alert('User registered successfully!');
//         navigate('/');
//       } else {
//         const data = await response.json();
//         if (data.error) {
//           alert(data.error);
//         } else {
//           alert('Failed to register user. Please try again.');
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
//         alert('Unable to connect to the server. Please check your internet connection or try again later.');
//       } else {
//         // Handle other unexpected errors
//         alert('An unexpected error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-6">Sign Up</h1>
//       <form className="w-80 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <input 
//             type="text" 
//             name="name"
//             placeholder="Username" 
//             className="w-full px-3 py-2 border rounded"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
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
//         <button onClick={handleSubmit} type="submit" className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           Register
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

// export default SignUpPage;








// // src/pages/SignUpPage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/signUpPage.css"; // Using our updated sign-up CSS

// // Base API URL – adjust if needed
// const API_BASE = 'http://localhost:7000/testingDB';

// const SignUpPage = () => {
//   const navigate = useNavigate();
  
//   // Combined form state
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
    
//     // Basic validation
//     if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
//       alert("Please fill out all fields.");
//       return;
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match. Please try again.");
//       return;
//     }
    
//     // Prepare payload (mapping fullName to name)
//     const payload = {
//       name: formData.fullName,
//       email: formData.email,
//       password: formData.password
//     };
    
//     try {
//       const response = await fetch(`${API_BASE}/usersregister`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
  
//       if (response.ok) {
//         alert('User registered successfully!');
//         navigate('/');
//       } else {
//         const data = await response.json();
//         if (data.error) {
//           alert(data.error);
//         } else {
//           alert('Failed to register user. Please try again.');
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
//         alert('Unable to connect to the server. Please check your internet connection or try again later.');
//       } else {
//         alert('An unexpected error occurred. Please try again.');
//       }
//     }
//   };
  
//   return (
//     <div className="signUp-container">
//       {/* Left Section – Branding */}
//       <div className="signUp-left-section">
//         <div className="signUp-header">
//           <div className="signUp-logo-box">
//             <img
//               src="../assets/logo.png"
//               alt="Taskwise Logo"
//               className="signUp-logo-image"
//             />
//           </div>
//           <div className="signUp-branding">
//             <h1 className="signUp-brand-name">TASKWISE</h1>
//             <p className="signUp-tagline">Smarter Scheduling, Better Productivity.</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Right Section – Registration Form */}
//       <div className="signUp-right-section">
//         <div className="signUp-form-wrapper">
//           <h2 className="signUp-form-title">SIGN UP</h2>
//           <p className="signUp-signin-prompt">
//             Already have an account? <a href="/signin">Sign In</a>
//           </p>
//           <form onSubmit={handleSubmit}>
//             <label htmlFor="fullName">Full Name</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               placeholder="John Doe"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//             />
  
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="JohnDoe@gmail.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
  
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
  
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               placeholder="••••••••"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
  
//             <button type="submit" id="signUpBtn">
//               SIGN UP <span className="signUp-arrow">→</span>
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;






// // src/pages/SignUpPage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/signUpPage.css";

// // Import the logo image using the same path as in MainPage
// import logoImage from '../assets/logo.png';

// const API_BASE = 'http://localhost:7000/testingDB';

// const SignUpPage = () => {
//   const navigate = useNavigate();
  
//   // Combined form state
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
    
//     // Basic validation
//     if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
//       alert("Please fill out all fields.");
//       return;
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match. Please try again.");
//       return;
//     }
    
//     // Prepare payload (mapping fullName to name)
//     const payload = {
//       name: formData.fullName,
//       email: formData.email,
//       password: formData.password
//     };
    
//     try {
//       const response = await fetch(`${API_BASE}/usersregister`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
  
//       if (response.ok) {
//         alert('User registered successfully!');
//         navigate('/');
//       } else {
//         const data = await response.json();
//         if (data.error) {
//           alert(data.error);
//         } else {
//           alert('Failed to register user. Please try again.');
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
//         alert('Unable to connect to the server. Please check your internet connection or try again later.');
//       } else {
//         alert('An unexpected error occurred. Please try again.');
//       }
//     }
//   };
  
//   return (
//     <div className="signUp-container">
//       <div className="signUp-main-content">
//         {/* Left Column: Branding */}
//         <div className="signUp-left-section">
//           <div className="signUp-header">
//             <div className="signUp-logo-box">
//               <img src={logoImage} alt="Taskwise Logo" className="signUp-logo-image" />
//             </div>
//             <div className="signUp-branding">
//               <h1 className="signUp-brand-name">TASKWISE</h1>
//               <p className="signUp-tagline">Smarter Scheduling, Better Productivity.</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Right Column: Sign Up Form in a small light-gray container */}
//         <div className="signUp-right-section">
//           <div className="signUp-form-container">
//             <h2 className="signUp-form-title">SIGN UP</h2>
//             <p className="signUp-signin-prompt">
//               Already have an account? <a href="/signin">Sign In</a>
//             </p>
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
    
//               <button type="submit" id="signUpBtn">
//                 SIGN UP <span className="signUp-arrow">→</span>
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
      
//       {/* Footer */}
//       <footer className="signUp-footer">
//         <p className="signUp-copyright">
//           TASK WISE © 2025. ALL RIGHTS RESERVED
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default SignUpPage;







// // src/pages/SignUpPage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/signUpPage.css"; // Using our updated sign-up CSS

// // Import the logo image (using the same path as in MainPage)
// import logoImage from '../assets/logo.png';

// const API_BASE = 'http://localhost:7000/testingDB';

// const SignUpPage = () => {
//   const navigate = useNavigate();
  
//   // Combined form state
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
    
//     // Basic validation
//     if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
//       alert("Please fill out all fields.");
//       return;
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match. Please try again.");
//       return;
//     }
    
//     // Prepare payload (mapping fullName to name)
//     const payload = {
//       name: formData.fullName,
//       email: formData.email,
//       password: formData.password
//     };
    
//     try {
//       const response = await fetch(`${API_BASE}/usersregister`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
  
//       if (response.ok) {
//         alert('User registered successfully!');
//         navigate('/');
//       } else {
//         const data = await response.json();
//         if (data.error) {
//           alert(data.error);
//         } else {
//           alert('Failed to register user. Please try again.');
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
//         alert('Unable to connect to the server. Please check your internet connection or try again later.');
//       } else {
//         alert('An unexpected error occurred. Please try again.');
//       }
//     }
//   };
  
//   return (
//     <div className="signUp-container">
//       <div className="signUp-main-content">
//         {/* Left Section – Branding */}
//         <div className="signUp-left-section">
//           <div className="signUp-branding-container">
//             <div className="signUp-header">
//               <div className="signUp-logo-box">
//                 <img src={logoImage} alt="Taskwise Logo" className="signUp-logo-image" />
//               </div>
//               <h1 className="signUp-brand-name">TASKWISE</h1>
//             </div>
//             <p className="signUp-tagline">Smarter Scheduling, Better Productivity.</p>
//           </div>
//         </div>
        
//         {/* Right Section – Registration Form */}
//         <div className="signUp-right-section">
//           <div className="signUp-form-container">
//             <h2 className="signUp-form-title">SIGN UP</h2>
//             <p className="signUp-signin-prompt">
//               Already have an account? <a href="/signin">Sign In</a>
//             </p>
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
    
//               <button type="submit" id="signUpBtn">
//                 SIGN UP <span className="signUp-arrow">→</span>
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
      
//       {/* Footer */}
//       <footer className="signUp-footer">
//         <p className="signUp-copyright">
//           TASK WISE © 2025. ALL RIGHTS RESERVED
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default SignUpPage;





// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/signUpPage.css"; // Using our updated sign-up CSS

// Import the brand image (which includes the brand name and tagline)
import brandImage from '../assets/brandname.png';

const API_BASE = 'http://localhost:7000/testingDB';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  // Combined form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    
    // Prepare payload (mapping fullName to name)
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password
    };
    
    try {
      const response = await fetch(`${API_BASE}/usersregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('User registered successfully!');
        navigate('/');
      } else {
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          alert('Failed to register user. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Unable to connect to the server. Please check your internet connection or try again later.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  return (
    <div className="signUp-container">
      <div className="signUp-main-content">
        {/* Left Section: Brand Image */}
        <div className="signUp-left-section">
          <img src={brandImage} alt="Brand Name and Tagline" className="signUp-brand-image" />
        </div>
        
        {/* Right Section: Registration Form */}
        <div className="signUp-right-section">
          <div className="signUp-form-container">
            <h2 className="signUp-form-title">SIGN UP</h2>
            <p className="signUp-signin-prompt">
              Already have an account? <a href="/signin">Sign In</a>
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
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
  
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
  
              <button type="submit" id="signUpBtn">
                SIGN UP <span className="signUp-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="signUp-footer">
        <p className="signUp-copyright">
          TASK WISE © 2025. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default SignUpPage;
