import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

export const DEMO_USER = {
  _id: 'demo_user_1',
  name: 'Ananya Sharma',
  email: 'ananya@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&q=80&auto=format&fit=crop',
  bio: 'Adventure seeker obsessed with sunsets, street food, and stories from the road.',
  location: 'Bangalore, India',
  token: 'demo-jwt-token-12345',
  isDemo: true,
};

export const loginDemo = createAsyncThunk('auth/loginDemo', async () => {
  localStorage.setItem('userInfo', JSON.stringify(DEMO_USER));
  return DEMO_USER;
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    if (email.toLowerCase() === 'ananya@example.com' || email.toLowerCase().includes('demo')) {
      localStorage.setItem('userInfo', JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const { data } = await api.put('/auth/profile', userData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    const current = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    const updated = { ...current, ...userData };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    return updated;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginDemo.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginDemo.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.userInfo = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
