import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Завантаження...' }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '200px',
			}}
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.3 }}
			>
				<CircularProgress size={60} />
			</motion.div>
			<Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
				{message}
			</Typography>
		</Box>
	);
};

export default LoadingSpinner;