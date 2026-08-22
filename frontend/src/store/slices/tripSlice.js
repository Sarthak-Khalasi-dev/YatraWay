import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const DEFAULT_TRIPS = [
  {
    _id: 'trip_1', id: 'trip_1', dest: 'Bali, Indonesia', status: 'Upcoming',
    dates: '20 May — 02 Jun 2024', days: 12, daysLeft: 12,
    progress: 70, budget: '₹55,000', spent: '₹38,500',
    img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Temple Tour', 'Surfing', 'Rice Terraces'], members: 2,
    notes: 'Book villa in Ubud. Check visa requirements.',
  },
  {
    _id: 'trip_2', id: 'trip_2', dest: 'Santorini, Greece', status: 'Upcoming',
    dates: '15 Jul — 25 Jul 2024', days: 10, daysLeft: 57,
    progress: 30, budget: '₹95,000', spent: '₹28,000',
    img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Caldera View', 'Wine Tasting', 'Sailing'], members: 2,
    notes: '',
  },
  {
    _id: 'trip_3', id: 'trip_3', dest: 'Kyoto, Japan', status: 'Wishlist',
    dates: 'Sep 2024', days: 9, daysLeft: null,
    progress: 10, budget: '₹1,30,000', spent: '₹0',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Geisha District', 'Tea Ceremony', 'Bamboo Grove'], members: 1,
    notes: 'Cherry blossom season is April.',
  },
];

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/trips');
    return data && data.length > 0 ? data : DEFAULT_TRIPS;
  } catch (error) {
    return DEFAULT_TRIPS;
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
