import React, { useState } from 'react';
import {
	Paper,
	TextField,
	Button,
	Box,
	Typography,
	InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const ValidationSearch = ({ onSearch }) => {
	const [ certificateId, setCertificateId ] = useState('');
	const [ error, setError ] = useState('');

	const handleSearch = () => {
		if (!certificateId.trim()) {
			setError('Будь ласка, введіть ID сертифікату');
			return;
		}
		setError('');
		onSearch(certificateId.trim());
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
		>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					maxWidth: 600,
					mx: 'auto',
					textAlign: 'center',
				}}
			>
				<SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}/>

				<Typography variant="h5" gutterBottom>
					Валідація сертифікату
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Введіть ID сертифікату для перевірки його автентичності
				</Typography>

				<Box sx={{ mb: 2 }}>
					<TextField
						fullWidth
						label="ID сертифікату"
						value={certificateId}
						onChange={(e) => {
							setCertificateId(e.target.value);
							setError('');
						}}
						onKeyPress={handleKeyPress}
						error={!!error}
						helperText={error}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<QrCodeScannerIcon/>
								</InputAdornment>
							),
						}}
						placeholder="Введіть або вставте ID сертифікату"
					/>
				</Box>

				<Button
					variant="contained"
					size="large"
					fullWidth
					onClick={handleSearch}
					startIcon={<SearchIcon/>}
					sx={{ py: 1.5 }}
				>
					Шукати та валідувати
				</Button>

				<Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
					Валідація перевіряє автентичність сертифікату в блокчейні
				</Typography>
			</Paper>
		</motion.div>
	);
};

export default ValidationSearch;