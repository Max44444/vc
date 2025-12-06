import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ValidationSearch from '../components/validation/ValidationSearch';

const ValidationPage = () => {
	const navigate = useNavigate();

	const handleSearch = (certificateId) => {
		navigate(`/certificate/${certificateId}`, {
			state: { autoValidate: true },
		});
	};

	return (
		<Container maxWidth="md">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Box sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
					<Typography variant="h3" component="h1" gutterBottom>
						Перевірка сертифікатів
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Безпечна валідація освітніх сертифікатів на блокчейні
					</Typography>
				</Box>

				<ValidationSearch onSearch={handleSearch}/>

				<Box sx={{ mt: 6, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
					<Typography variant="h6" gutterBottom>
						Як це працює?
					</Typography>
					<Typography variant="body2" paragraph>
						1. Введіть або вставте ID сертифікату, який ви хочете перевірити
					</Typography>
					<Typography variant="body2" paragraph>
						2. Система автоматично знайде сертифікат у блокчейні
					</Typography>
					<Typography variant="body2" paragraph>
						3. Буде виконана валідація автентичності через перевірку DID емітента та цифрового підпису
					</Typography>
					<Typography variant="body2">
						4. Ви отримаєте повну інформацію про сертифікат та результат валідації
					</Typography>
				</Box>
			</motion.div>
		</Container>
	);
};

export default ValidationPage;