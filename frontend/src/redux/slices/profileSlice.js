import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:7000/token';

export const fetchProfileStats = createAsyncThunk(
    'profile/fetchStats',
    async (_, { getState, rejectWithValue }) => {
      try {
        const { token } = getState().auth;
        // console.log('Fetching profile stats with token in SLICE:', token); // Uncomment this
  
        const response = await axios.get(`${API_BASE}/profileStats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        // console.log('Response SLICE data:', response.data); // Should now appear
        return response.data.profileStats;
      } catch (error) {
        console.error('Fetch error:', error.response?.data || error.message); // Detailed error
        return rejectWithValue(error.response?.data?.error || error.message);
      }
    }
  );
  

export const updateProfileStats = createAsyncThunk(
  'profile/updateStats',
  async (updateData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
    //   console.log('Fetching profile stats with token in SLICE:', token);
      const response = await axios.patch(`${API_BASE}/profileStats`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.error);
      }

      return response.data.profileStats; // Return updated profileStats
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    stats: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload; // Store directly into stats
        state.error = null;
      })
      .addCase(fetchProfileStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfileStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfileStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload; // Update existing stats
        state.error = null;
      })
      .addCase(updateProfileStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default profileSlice.reducer;
