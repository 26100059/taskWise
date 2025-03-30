import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateProfileStats } from './profileSlice'; // Import the action from profileSlice

// Async thunks
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.post('/api/tasks', taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'tasks/fetchTimeSlots',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.get('/api/tasks/timeSlots', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
);

export const updateTimeSlot = createAsyncThunk(
  'tasks/updateTimeSlot',
  async ({ id, start_time, end_time }, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.put(`/api/tasks/timeSlots/${id}`, 
      { start_time, end_time },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
);

export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAllTasks',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.get('/api/tasks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    timeSlots: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
      })
    //   .addCase(createTask.fulfilled, (state, action) => {
    //     state.status = 'succeeded';
    //     state.tasks.push(action.payload);
    //   })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

       // Add to extraReducers after task operations
      .addCase(createTask.fulfilled, (state, action) => {
        const dispatch = useDispatch();
        state.status = 'succeeded';
        state.tasks.push(action.payload);
        // Dispatch profile stats update
        dispatch(updateProfileStats({
        userId: action.payload.user_id,
        updateData: { xp: action.payload.duration * 10 } // Example XP calculation
  }));
        })
      
      // Fetch TimeSlots
      .addCase(fetchTimeSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.timeSlots = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Update TimeSlot
      .addCase(updateTimeSlot.fulfilled, (state, action) => {
        const index = state.timeSlots.findIndex(
          slot => slot._id === action.payload._id
        );
        if (index !== -1) {
          state.timeSlots[index] = action.payload;
        }
      })
      
      // Fetch All Tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default taskSlice.reducer;

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectTimeSlots = (state) => state.tasks.timeSlots;
export const selectTasksStatus = (state) => state.tasks.status;
export const selectTasksError = (state) => state.tasks.error;
