import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

export const DEMO_USER = {
  _id: 'demo_user_1',
  id: 'demo_user_1',
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (email.toLowerCase() === 'ananya@example.com' || email.toLowerCase().includes('demo')) {
        localStorage.setItem('userInfo', JSON.stringify(DEMO_USER));
        return DEMO_USER;
      }
      return thunkAPI.rejectWithValue(error.message);
    }
    const userObj = {
      id: data.user.id,
      _id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
      avatar: data.user.user_metadata?.avatar_url || DEMO_USER.avatar,
    };
    localStorage.setItem('userInfo', JSON.stringify(userObj));
    return userObj;
  } catch (error) {
    if (email.toLowerCase() === 'ananya@example.com' || email.toLowerCase().includes('demo')) {
      localStorage.setItem('userInfo', JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }
    return thunkAPI.rejectWithValue(error.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, thunkAPI) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return thunkAPI.rejectWithValue(error.message);
    
    const userObj = {
      id: data.user?.id || 'new_user',
      _id: data.user?.id || 'new_user',
      email: email,
      name: name,
      avatar: DEMO_USER.avatar,
    };
    localStorage.setItem('userInfo', JSON.stringify(userObj));
    return userObj;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const current = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    if (current.id && userData.name) {
      await supabase.from('profiles').update({ full_name: userData.name }).eq('id', current.id);
    }
    const updated = { ...current, ...userData };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    return updated;
  } catch {
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
      supabase.auth.signOut().catch(() => {});
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
