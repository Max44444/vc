import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Button, Box, Alert, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import CertificateList from '../components/issuer/CertificateList';
import IssueCertificateForm from '../components/issuer/IssueCertificateForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
	fetchCertificatesByIssuer,
	issueCertificate,
} from '../store/slices/certificateSlice';

const IssuerPage = () => {
	const { issuerId } = useParams();
	const dispatch = useDispatch();
	const { items: certificates, loading, error } = useSelector((state) => state.certificates);
	const [ formOpen, setFormOpen ] = useState(false);

	useEffect(() => {
		dispatch(fetchCertificatesByIssuer(issuerId));
	}, [ dispatch, issuerId ]);

	const handleIssue = (certificateData) => {
		dispatch(issueCertificate({ issuerId, certificateData }));
	};

	if (loading && certificates.length === 0) {
		return <LoadingSpinner message="Завантаження сертифікатів..."/>;
	}

	return (
		<Container maxWidth="lg">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'white' }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div>
							<Typography variant="h4" component="h1" gutterBottom>
								Видача сертифікатів
							</Typography>
							<Typography variant="body1">
								ID Емітента: {issuerId}
							</Typography>
						</div>
						<Button
							variant="contained"
							color="secondary"
							startIcon={<AddIcon/>}
							onClick={() => setFormOpen(true)}
							size="large"
							sx={{ backgroundColor: 'white', color: 'primary.main' }}
						>
							Видати сертифікат
						</Button>
					</Box>
				</Paper>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Typography variant="h5" sx={{ mb: 2 }}>
					Видані сертифікати
				</Typography>

				{certificates.length === 0 ? (
					<Alert severity="info">
						Ще немає виданих сертифікатів. Видайте перший сертифікат для початку роботи.
					</Alert>
				) : (
					<CertificateList certificates={certificates}/>
				)}

				<IssueCertificateForm
					open={formOpen}
					onClose={() => setFormOpen(false)}
					onSubmit={handleIssue}
				/>
			</motion.div>
		</Container>
	);
};

export default IssuerPage;