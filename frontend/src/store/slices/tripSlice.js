import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/trips');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const createTrip = createAsyncThunk('trips/createTrip', async (tripData, thunkAPI) => {
  try {
    const { data } = await api.post('/trips', tripData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const updateTrip = createAsyncThunk('trips/updateTrip', async ({ id, tripData }, thunkAPI) => {
  try {
    const { data } = await api.put(`/trips/${id}`, tripData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const deleteTrip = createAsyncThunk('trips/deleteTrip', async (id, thunkAPI) => {
  try {
    await api.delete(`/trips/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => { state.loading = true; })
      .addCase(fetchTrips.fulfilled, (state, action) => { state.loading = false; state.trips = action.payload; })
      .addCase(fetchTrips.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTrip.fulfilled, (state, action) => { state.trips.push(action.payload); })
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.trips.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.trips[index] = action.payload;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter(t => t._id !== action.payload);
      });
  },
});

export default tripSlice.reducer;
