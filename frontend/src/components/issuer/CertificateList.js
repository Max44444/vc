import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	IconButton,
	Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const CertificateList = ({ certificates }) => {
	const navigate = useNavigate();

	const getStatusColor = (status) => {
		switch (status) {
			case 'active':
				return 'success';
			case 'revoked':
				return 'error';
			default:
				return 'default';
		}
	};

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

	return (
		<TableContainer component={Paper} elevation={2}>
			<Table>
				<TableHead>
					<TableRow sx={{ backgroundColor: 'primary.main' }}>
						<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
						<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Отримувач</TableCell>
						<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Тип сертифікату</TableCell>
						<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Дата видачі</TableCell>
						<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Статус</TableCell>
						<TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Дії</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{certificates.map((cert, index) => (
						<motion.tr
							key={cert.id}
							component={TableRow}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							hover
						>
							<TableCell sx={{ fontFamily: 'monospace' }}>
								{cert.id.substring(0, 8)}...
							</TableCell>
							<TableCell>{cert.recipientName}</TableCell>
							<TableCell>{certificateTypes.find(t => t.value === cert.certificateType)?.label || "Course"}</TableCell>
							<TableCell>{formatDate(cert.issuanceDate)}</TableCell>
							<TableCell>
								<Chip
									label={cert.status === 'active' ? 'Активний' : 'Відкликаний'}
									color={getStatusColor(cert.status)}
									size="small"
								/>
							</TableCell>
							<TableCell align="right">
								<Tooltip title="Переглянути">
									<IconButton
										size="small"
										color="primary"
										onClick={() => navigate(`/certificate/${cert.id}`)}
									>
										<VisibilityIcon/>
									</IconButton>
								</Tooltip>
							</TableCell>
						</motion.tr>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CertificateList;