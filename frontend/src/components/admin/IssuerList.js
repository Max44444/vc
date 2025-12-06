import React, { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Chip,
	Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../common/ConfirmDialog';

const IssuerList = ({ issuers, onEdit, onDelete }) => {
	const navigate = useNavigate();
	const [ deleteDialog, setDeleteDialog ] = useState({ open: false, issuer: null });

	const handleDeleteClick = (issuer) => {
		setDeleteDialog({ open: true, issuer });
	};

	const handleDeleteConfirm = () => {
		if (deleteDialog.issuer) {
			onDelete(deleteDialog.issuer.id);
		}
		setDeleteDialog({ open: false, issuer: null });
	};

	return (
		<>
			<TableContainer component={Paper} elevation={2}>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: 'primary.main' }}>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Назва</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>DID</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Статус</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Дії</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{issuers.map((issuer, index) => (
							<motion.tr
								key={issuer.id}
								component={TableRow}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								hover
							>
								<TableCell>{issuer.id}</TableCell>
								<TableCell>{issuer.name}</TableCell>
								<TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
									{issuer.did?.substring(0, 20)}...
								</TableCell>
								<TableCell>
									<Chip
										label={issuer.active ? 'Активний' : 'Неактивний'}
										color={issuer.active ? 'success' : 'default'}
										size="small"
									/>
								</TableCell>
								<TableCell align="right">
									<Tooltip title="Сертифікати">
										<IconButton
											size="small"
											color="primary"
											onClick={() => navigate(`/issuer/${issuer.id}`)}
										>
											<AssignmentIcon/>
										</IconButton>
									</Tooltip>
									<Tooltip title="Редагувати">
										<IconButton
											size="small"
											color="primary"
											onClick={() => onEdit(issuer)}
										>
											<EditIcon/>
										</IconButton>
									</Tooltip>
									<Tooltip title="Видалити">
										<IconButton
											size="small"
											color="error"
											onClick={() => handleDeleteClick(issuer)}
										>
											<DeleteIcon/>
										</IconButton>
									</Tooltip>
								</TableCell>
							</motion.tr>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<ConfirmDialog
				open={deleteDialog.open}
				onClose={() => setDeleteDialog({ open: false, issuer: null })}
				onConfirm={handleDeleteConfirm}
				title="Видалити емітента"
				message={`Ви впевнені, що хочете видалити емітента "${deleteDialog.issuer?.name}"?`}
				confirmText="Видалити"
				cancelText="Скасувати"
			/>
		</>
	);
};

export default IssuerList;