import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				py: 3,
				px: 2,
				mt: 'auto',
				backgroundColor: (theme) => theme.palette.grey[200],
			}}
		>
			<Container maxWidth="lg">
				<Typography variant="body2" color="text.secondary" align="center">
					© {new Date().getFullYear()} Система Верифікації Сертифікатів на Blockchain
				</Typography>
				<Typography variant="caption" color="text.secondary" align="center" display="block">
					Використовує Verifiable Credentials та IPFS
				</Typography>
			</Container>
		</Box>
	);
};

export default Footer;