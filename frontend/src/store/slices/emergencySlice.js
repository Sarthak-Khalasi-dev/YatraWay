import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchContacts = createAsyncThunk('emergency/fetchContacts', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/emergency');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const addContact = createAsyncThunk('emergency/addContact', async (contactData, thunkAPI) => {
  try {
    const { data } = await api.post('/emergency', contactData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const removeContact = createAsyncThunk('emergency/removeContact', async (id, thunkAPI) => {
  try {
    await api.delete(`/emergency/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

const emergencySlice = createSlice({
  name: 'emergency',
  initialState: {
    contacts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => { state.loading = true; })
      .addCase(fetchContacts.fulfilled, (state, action) => { state.loading = false; state.contacts = action.payload; })
      .addCase(fetchContacts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addContact.fulfilled, (state, action) => { state.contacts.push(action.payload); })
      .addCase(removeContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c._id !== action.payload);
      });
  },
});

export default emergencySlice.reducer;
