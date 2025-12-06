import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCertificatesByIssuer = createAsyncThunk(
	'certificates/fetchByIssuer',
	async (issuerId) => {
		const response = await api.get(`/issuer/certificates?issuerId=${issuerId}`);
		return response.data;
	}
);

export const fetchCertificateById = createAsyncThunk(
	'certificates/fetchById',
	async (certificateId) => {
		const response = await api.get(`/issuer/certificate?id=${certificateId}`);
		return response.data;
	}
);

export const issueCertificate = createAsyncThunk(
	'certificates/issue',
	async ({ issuerId, certificateData }) => {
		const response = await api.post(`/issuer/issue`, {
			issuerDID: issuerId,
			issuerName: "KPI University",
			holderDID: certificateData.recipientDid,
			holderName: certificateData.recipientName,
			achievement: {
				type: certificateData.certificateType,
				name: certificateData.courseName,
				description: certificateData.description,
				creditsEarned: 5,
				completionDate: certificateData.completionDate,
				grade: certificateData.grade,
				pdfData: certificateData.pdfData,
				skills: ["Blockchain", "Smart Contracts"]
			}
		});
		return response.data;
	}
);

export const validateCertificate = createAsyncThunk(
	'certificates/validate',
	async (certificateId) => {
		const response = await api.post(`/issuer/validate?id=${certificateId}`);
		return response.data;
	}
);

const certificateSlice = createSlice({
	name: 'certificates',
	initialState: {
		items: [],
		currentCertificate: null,
		validationResult: null,
		loading: false,
		error: null,
	},
	reducers: {
		clearValidationResult: (state) => {
			state.validationResult = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCertificatesByIssuer.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCertificatesByIssuer.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchCertificatesByIssuer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(fetchCertificateById.fulfilled, (state, action) => {
				state.currentCertificate = action.payload;
			})
			.addCase(issueCertificate.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})
			.addCase(validateCertificate.pending, (state) => {
				state.loading = true;
			})
			.addCase(validateCertificate.fulfilled, (state, action) => {
				state.loading = false;
				state.validationResult = action.payload;
			})
			.addCase(validateCertificate.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export const { clearValidationResult } = certificateSlice.actions;
export default certificateSlice.reducer;