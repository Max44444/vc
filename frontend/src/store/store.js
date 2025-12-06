import { configureStore } from '@reduxjs/toolkit';
import issuerReducer from './slices/issuerSlice';
import certificateReducer from './slices/certificateSlice';

const store = configureStore({
	reducer: {
		issuers: issuerReducer,
		certificates: certificateReducer,
	},
});

export default store;