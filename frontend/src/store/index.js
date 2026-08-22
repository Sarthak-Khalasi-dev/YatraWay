import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tripReducer from './slices/tripSlice';
import emergencyReducer from './slices/emergencySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    emergency: emergencyReducer,
  },
});

export default store;
