import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2',
			light: '#42a5f5',
			dark: '#1565c0',
		},
		secondary: {
			main: '#9c27b0',
			light: '#ba68c8',
			dark: '#7b1fa2',
		},
		success: {
			main: '#2e7d32',
		},
		error: {
			main: '#d32f2f',
		},
		background: {
			default: '#f5f5f5',
			paper: '#ffffff',
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h4: {
			fontWeight: 600,
		},
		h5: {
			fontWeight: 500,
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 500,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
				},
			},
		},
	},
});

export default theme;