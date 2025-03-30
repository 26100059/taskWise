// import React, { createContext, useState, useEffect } from 'react';

// // Create the context
// export const AuthContext = createContext();

// // A provider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Dummy login function for example purposes
//   const login = (userData) => {
//     // Here you would typically authenticate the user, then set the user state.
//     setUser(userData);
//   };

//   // On mount, you might check for an existing session/token, etc.
//   useEffect(() => {
//     // For demo, assume no persisted session:
//     // setUser({ _id: "67d969c8ffe2d35e82afa56d", name: "John Doe", email: "john@example.com" });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // For testing purposes, set a dummy user on mount.
//   useEffect(() => {
//     const dummyUser = { _id: "67d969c8ffe2d35e82afa56d", name: "John Doe", email: "john@example.com" };
//     setUser(dummyUser);
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // For testing, set the dummy user on mount with the new user's details.
//   useEffect(() => {
//     const dummyUser = {
//       _id: "67d96ed12fa6e5fb171af63f",  // New user's _id
//       name: "shelock holmes",
//       email: "holmes@aol.com"
//     };
//     setUser(dummyUser);
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // For testing, set a dummy user on mount (update with new user's data)
  useEffect(() => {
    const dummyUser = {
      _id: "67d96ed12fa6e5fb171af63f",
      name: "shelock holmes",
      email: "holmes@aol.com"
    };
    setUser(dummyUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};