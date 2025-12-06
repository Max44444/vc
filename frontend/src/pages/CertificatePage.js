import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Container } from '@mui/material';
import { motion } from 'framer-motion';
import CertificateDetails from '../components/certificate/CertificateDetails';
import ValidationButton from '../components/certificate/ValidationButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchCertificateById, validateCertificate, } from '../store/slices/certificateSlice';

const CertificatePage = () => {
	const { certificateId } = useParams();
	const location = useLocation();
	const dispatch = useDispatch();
	const { currentCertificate, loading, error } = useSelector((state) => state.certificates);

	const autoValidate = location.state?.autoValidate;

	useEffect(() => {
		dispatch(fetchCertificateById(certificateId));
	}, [ dispatch, certificateId ]);

	useEffect(() => {
		if (autoValidate && currentCertificate) {
			handleValidate(certificateId);
		}
	}, [ autoValidate, currentCertificate ]);

	const handleValidate = async (id) => {
		return await dispatch(validateCertificate(id)).unwrap();
	};

	if (loading && !currentCertificate) {
		return <LoadingSpinner message="Завантаження сертифікату..."/>;
	}

	if (error) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Alert severity="error">{error}</Alert>
			</Container>
		);
	}

	if (!currentCertificate) {
		return (
			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Alert severity="warning">Сертифікат не знайдено</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth="md">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<CertificateDetails certificate={currentCertificate}/>
				<ValidationButton
					certificateId={certificateId}
					onValidate={handleValidate}
				/>
			</motion.div>
		</Container>
	);
};

export default CertificatePage;