import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchIssuers = createAsyncThunk(
	'issuers/fetchAll',
	async () => {
		const response = await api.get('/issuers');
		return response.data;
	}
);

export const createIssuer = createAsyncThunk(
	'issuers/create',
	async (issuerData) => {
		const response = await api.post('/issuers', issuerData);
		return response.data;
	}
);

export const updateIssuer = createAsyncThunk(
	'issuers/update',
	async ({ id, data }) => {
		const response = await api.put(`/issuers/${id}`, data);
		return response.data;
	}
);

export const deleteIssuer = createAsyncThunk(
	'issuers/delete',
	async (id) => {
		await api.delete(`/issuers/${id}`);
		return id;
	}
);

const issuerSlice = createSlice({
	name: 'issuers',
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIssuers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIssuers.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchIssuers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(createIssuer.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})
			.addCase(updateIssuer.fulfilled, (state, action) => {
				const index = state.items.findIndex(i => i.id === action.payload.id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
			})
			.addCase(deleteIssuer.fulfilled, (state, action) => {
				state.items = state.items.filter(i => i.id !== action.payload);
			});
	},
});

export default issuerSlice.reducer;