import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:7000/token';

// redux/slices/authSlice.js
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    // console.log('loginUser thunk started', { email, password }); // Debugging: Log input parameters

    try {
      // console.log('Attempting login to:', `${API_BASE}/userslogin`); // Debugging: Log API endpoint
      const response = await axios.post(`${API_BASE}/userslogin`, {
        email,
        password
      }, {
        timeout: 5000 // Add timeout
      });

      // console.log('Login response:', response); // Debugging: Log entire response object

      // Verify response structure
      if (!response.data?.token) {
        console.error('Invalid server response: Missing token'); // Debugging: Log specific error
        throw new Error('Invalid server response: Missing token');
      }

      // console.log('Login successful, token:', response.data.token); // Debugging: Log token
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error); // Debugging: Log the entire error object

      // Handle network errors
      if (error.code === 'ECONNABORTED') {
        console.error('Connection timeout error'); // Debugging: Specific error
        return rejectWithValue('Connection timeout');
      }
      if (!error.response) {
        console.error('Server unavailable error'); // Debugging: Specific error
        return rejectWithValue('Server unavailable');
      }

      console.error('Login error response data:', error.response?.data); // Debugging: Log error response data

      return rejectWithValue(error.response.data.error || 'Login failed');
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    // console.log('registerUser thunk started', { name, email, password }); // Debugging: Log input parameters
    try {
      // console.log('Attempting registration to:', `${API_BASE}/usersregister`); // Debugging: Log API endpoint
      const response = await axios.post(`${API_BASE}/usersregister`, {
        name,
        email,
        password
      });
      // console.log('Registration response:', response); // Debugging: Log entire response object
      return response.data;
    } catch (error) {
      console.error('Registration error:', error); // Debugging: Log the entire error object
      console.error('Registration error response data:', error.response?.data); // Debugging: Log error response data
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // console.log('logout reducer called'); // Debugging: Log when logout is triggered
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    setCredentials: (state, action) => {
      //  console.log('setCredentials reducer called with payload:', action.payload);  // Debugging
      state.user = action.payload.user;
      state.token = action.payload.token;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        // console.log('loginUser.pending'); // Debugging: Log state transitions
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log('loginUser.fulfilled with payload:', action.payload); // Debugging: Log state transitions and payload
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        // console.log('loginUser.rejected with payload:', action.payload); // Debugging: Log state transitions and payload
        // console.log('loginUser.rejected error: ', action.payload)
        state.status = 'failed';
        state.error = action.payload || 'Login failed'; //use the action.payload to display error from backend
      })
      .addCase(registerUser.pending, (state) => {
        // console.log('registerUser.pending'); // Debugging: Log state transitions
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state) => {
        // console.log('registerUser.fulfilled'); // Debugging: Log state transitions
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        // console.log('registerUser.rejected with payload:', action.payload); // Debugging: Log state transitions and payload
        state.status = 'failed';
        state.error = action.payload?.error || 'Registration failed';
      });
  }
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => {
  // console.log('selectCurrentUser called, returning:', state.auth.user); // Debugging
  return state.auth.user;
}
export const selectAuthToken = (state) => {
  // console.log('selectAuthToken called, returning:', state.auth.token); // Debugging
  return state.auth.token;
}
export const selectAuthStatus = (state) => {
  // console.log('selectAuthStatus called, returning:', state.auth.status); // Debugging
  return state.auth.status;
}
export const selectAuthError = (state) => {
  // console.log('selectAuthError called, returning:', state.auth.error); // Debugging
  return state.auth.error;
}
