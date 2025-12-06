import React from 'react';
import {
	Card,
	CardContent,
	Grid,
	Typography,
	Chip,
	Box,
	Divider,
	Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PdfViewer from './PdfViewer';

const CertificateDetails = ({ certificate }) => {
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('uk-UA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const certificateTypes = [
		{ value: 'completion', label: 'Сертифікат завершення курсу' },
		{ value: 'achievement', label: 'Сертифікат досягнень' },
		{ value: 'participation', label: 'Сертифікат участі' },
		{ value: 'excellence', label: 'Сертифікат відмінності' },
	];

	const DetailItem = ({ icon, label, value }) => (
		<Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
			<Box sx={{ mr: 2, color: 'primary.main' }}>
				{icon}
			</Box>
			<Box>
				<Typography variant="caption" color="text.secondary" display="block">
					{label}
				</Typography>
				<Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
					{value}
				</Typography>
			</Box>
		</Box>
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card elevation={3}>
				<Box
					sx={{
						background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
						color: 'white',
						p: 3,
						textAlign: 'center',
					}}
				>
					<VerifiedIcon sx={{ fontSize: 60, mb: 2 }}/>
					<Typography variant="h4" gutterBottom>
						{certificate.courseName}
					</Typography>
					<Chip
						label={certificate.status === 'active' ? 'Активний' : 'Відкликаний'}
						color={certificate.status === 'active' ? 'success' : 'error'}
						sx={{ mt: 1 }}
					/>
				</Box>

				{certificate.pdfData && (
					<Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
						<Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
							PDF Сертифікат
						</Typography>
						<PdfViewer pdfData={certificate.pdfData}/>
					</Box>
				)}

				<CardContent sx={{ p: 4 }}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
								<Typography variant="h6" gutterBottom color="primary">
									Інформація про отримувача
								</Typography>
								<Divider sx={{ mb: 2 }}/>

								<DetailItem
									icon={<PersonIcon/>}
									label="Ім'я отримувача"
									value={certificate.recipientName}
								/>

								<DetailItem
									icon={<FingerprintIcon/>}
									label="DID отримувача"
									value={certificate.recipientDid}
								/>
							</Paper>
						</Grid>

						<Grid item xs={12} md={6}>
							<Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
								<Typography variant="h6" gutterBottom color="primary">
									Деталі сертифікату
								</Typography>
								<Divider sx={{ mb: 2 }}/>

								<DetailItem
									icon={<SchoolIcon/>}
									label="Тип сертифікату"
									value={certificateTypes.find(t => t.value === certificate.certificateType)?.label || "Course"}
								/>

								<DetailItem
									icon={<CalendarTodayIcon/>}
									label="Дата видачі"
									value={formatDate(certificate.issuanceDate)}
								/>

								{certificate.grade && (
									<DetailItem
										icon={<VerifiedIcon/>}
										label="Оцінка"
										value={certificate.grade}
									/>
								)}
							</Paper>
						</Grid>

						{certificate.description && (
							<Grid item xs={12}>
								<Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
									<Typography variant="h6" gutterBottom color="primary">
										Опис
									</Typography>
									<Divider sx={{ mb: 2 }}/>
									<Typography variant="body1">
										{certificate.description}
									</Typography>
								</Paper>
							</Grid>
						)}

						<Grid item xs={12}>
							<Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
								<Typography variant="h6" gutterBottom color="primary">
									Blockchain дані
								</Typography>
								<Divider sx={{ mb: 2 }}/>

								<DetailItem
									icon={<FingerprintIcon/>}
									label="ID сертифікату"
									value={certificate.id}
								/>

								<DetailItem
									icon={<FingerprintIcon/>}
									label="DID емітента"
									value={certificate.issuerDid}
								/>

								{certificate.ipfsCid && (
									<DetailItem
										icon={<FingerprintIcon/>}
										label="IPFS CID"
										value={certificate.ipfsCid}
									/>
								)}
							</Paper>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default CertificateDetails;