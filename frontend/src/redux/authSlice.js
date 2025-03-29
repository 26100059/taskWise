import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            //   state.user = action.payload;
            state.user = {
                userId: action.payload.userId,
                token: action.payload.token,
                name: action.payload.name,  // ✅ Added 'name' field
            };
            localStorage.setItem('user', JSON.stringify(action.payload)); // Save user data
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
