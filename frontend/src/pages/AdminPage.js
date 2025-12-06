import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Button, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import IssuerList from '../components/admin/IssuerList';
import IssuerForm from '../components/admin/IssuerForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
	fetchIssuers,
	createIssuer,
	updateIssuer,
	deleteIssuer,
} from '../store/slices/issuerSlice';

const AdminPage = () => {
	const dispatch = useDispatch();
	const { items: issuers, loading, error } = useSelector((state) => state.issuers);
	const [ formOpen, setFormOpen ] = useState(false);
	const [ editingIssuer, setEditingIssuer ] = useState(null);

	useEffect(() => {
		dispatch(fetchIssuers());
	}, [ dispatch ]);

	const handleCreate = () => {
		setEditingIssuer(null);
		setFormOpen(true);
	};

	const handleEdit = (issuer) => {
		setEditingIssuer(issuer);
		setFormOpen(true);
	};

	const handleSubmit = (issuerData) => {
		if (editingIssuer) {
			dispatch(updateIssuer({ id: editingIssuer.id, data: issuerData }));
		} else {
			dispatch(createIssuer(issuerData));
		}
	};

	const handleDelete = (id) => {
		dispatch(deleteIssuer(id));
	};

	if (loading && issuers.length === 0) {
		return <LoadingSpinner message="Завантаження емітентів..."/>;
	}

	return (
		<Container maxWidth="lg">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant="h4" component="h1" gutterBottom>
						Управління емітентами
					</Typography>
					<Button
						variant="contained"
						startIcon={<AddIcon/>}
						onClick={handleCreate}
						size="large"
					>
						Додати емітента
					</Button>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{issuers.length === 0 ? (
					<Alert severity="info">
						Немає зареєстрованих емітентів. Додайте першого емітента для початку роботи.
					</Alert>
				) : (
					<IssuerList
						issuers={issuers}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				)}

				<IssuerForm
					open={formOpen}
					onClose={() => setFormOpen(false)}
					onSubmit={handleSubmit}
					issuer={editingIssuer}
				/>
			</motion.div>
		</Container>
	);
};

export default AdminPage;