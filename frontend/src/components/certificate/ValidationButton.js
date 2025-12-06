import React, { useState } from 'react';
import { Button, CircularProgress, Alert, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ErrorIcon from '@mui/icons-material/Error';

const ValidationButton = ({ certificateId, onValidate }) => {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);

	const handleValidate = async () => {
		setLoading(true);
		setResult(null);

		try {
			const validationResult = await onValidate(certificateId);
			setResult(validationResult);
		} catch (error) {
			setResult({
				isValid: false,
				message: error.message || 'Помилка валідації',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ mt: 3 }}>
			<Button
				variant="contained"
				size="large"
				fullWidth
				startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedUserIcon />}
				onClick={handleValidate}
				disabled={loading}
				sx={{
					py: 1.5,
					fontSize: '1.1rem',
				}}
			>
				{loading ? 'Валідація...' : 'Валідувати сертифікат'}
			</Button>

			<AnimatePresence>
				{result && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
					>
						<Alert
							severity={result.isValid ? 'success' : 'error'}
							icon={result.isValid ? <VerifiedUserIcon /> : <ErrorIcon />}
							sx={{ mt: 2 }}
						>
							<strong>
								{result.isValid ? 'Сертифікат валідний' : 'Сертифікат невалідний'}
							</strong>
							<br />
							{result.message}
						</Alert>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default ValidationButton;