import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Grid,
	MenuItem,
	Alert,
	Box,
	Typography,
	Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ConfirmDialog from '../common/ConfirmDialog';

const IssueCertificateForm = ({ open, onClose, onSubmit }) => {
	const [ formData, setFormData ] = useState({
		recipientName: '',
		recipientDid: '',
		certificateType: '',
		courseName: '',
		grade: '',
		completionDate: '',
		description: '',
		pdfData: null,
	});

	const [ pdfFile, setPdfFile ] = useState(null);
	const [ errors, setErrors ] = useState({});
	const [ confirmOpen, setConfirmOpen ] = useState(false);

	const certificateTypes = [
		{ value: 'completion', label: 'Сертифікат завершення курсу' },
		{ value: 'achievement', label: 'Сертифікат досягнень' },
		{ value: 'participation', label: 'Сертифікат участі' },
		{ value: 'excellence', label: 'Сертифікат відмінності' },
	];

	function bytesToBase64(bytes) {
		let binary = '';
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	}

	const handlePdfUpload = async (event) => {
		const file = event.target.files[0];

		if (file) {
			if (file.type !== 'application/pdf') {
				setErrors({ ...errors, pdf: 'Будь ласка, завантажте PDF файл' });
				return;
			}

			if (file.size > 10 * 1024 * 1024) {
				setErrors({ ...errors, pdf: 'Розмір файлу не повинен перевищувати 10MB' });
				return;
			}

			try {
				const arrayBuffer = await file.arrayBuffer();
				const bytes = new Uint8Array(arrayBuffer);
				setPdfFile(file);
				setFormData({
					...formData,
					pdfData: bytesToBase64(bytes),
				});
				setErrors({ ...errors, pdf: null });
			} catch (error) {
				console.error('Помилка завантаження PDF:', error);
				setErrors({ ...errors, pdf: 'Помилка завантаження файлу' });
			}
		}
	};

	const handleRemovePdf = () => {
		setPdfFile(null);
		setFormData({
			...formData,
			pdfData: null,
		});
	};

	const validate = () => {
		const newErrors = {};

		if (!formData.recipientName.trim()) {
			newErrors.recipientName = "Ім'я отримувача є обов'язковим";
		}

		if (!formData.recipientDid.trim()) {
			newErrors.recipientDid = "DID отримувача є обов'язковим";
		}

		if (!formData.certificateType) {
			newErrors.certificateType = "Оберіть тип сертифікату";
		}

		if (!formData.courseName.trim()) {
			newErrors.courseName = "Назва курсу є обов'язковою";
		}

		if (!formData.completionDate) {
			newErrors.completionDate = "Дата завершення є обов'язковою";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validate()) {
			setConfirmOpen(true);
		}
	};

	const handleConfirm = () => {
		onSubmit(formData);
		setConfirmOpen(false);
		handleClose();
	};

	const handleClose = () => {
		setFormData({
			recipientName: '',
			recipientDid: '',
			certificateType: '',
			courseName: '',
			grade: '',
			completionDate: '',
			description: '',
			pdfData: null,
		});
		setPdfFile(null);
		setErrors({});
		onClose();
	};

	const handleChange = (field) => (event) => {
		setFormData({
			...formData,
			[field]: event.target.value,
		});
		if (errors[field]) {
			setErrors({ ...errors, [field]: null });
		}
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
				<DialogTitle>Видати новий сертифікат</DialogTitle>
				<DialogContent>
					<Alert severity="info" sx={{ mt: 2, mb: 3 }}>
						Після підтвердження сертифікат буде записано в блокчейн та не зможе бути змінений
					</Alert>

					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Ім'я отримувача"
								value={formData.recipientName}
								onChange={handleChange('recipientName')}
								error={!!errors.recipientName}
								helperText={errors.recipientName}
								required
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								label="DID отримувача"
								value={formData.recipientDid}
								onChange={handleChange('recipientDid')}
								error={!!errors.recipientDid}
								helperText={errors.recipientDid || "Приклад: did:ethr:0x..."}
								required
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								select
								label="Тип сертифікату"
								value={formData.certificateType}
								onChange={handleChange('certificateType')}
								error={!!errors.certificateType}
								helperText={errors.certificateType}
								required
							>
								{certificateTypes.map((type) => (
									<MenuItem key={type.value} value={type.value}>
										{type.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label="Назва курсу"
								value={formData.courseName}
								onChange={handleChange('courseName')}
								error={!!errors.courseName}
								helperText={errors.courseName}
								required
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label="Оцінка (опціонально)"
								value={formData.grade}
								onChange={handleChange('grade')}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								type="date"
								label="Дата завершення"
								value={formData.completionDate}
								onChange={handleChange('completionDate')}
								error={!!errors.completionDate}
								helperText={errors.completionDate}
								InputLabelProps={{ shrink: true }}
								required
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Додаткова інформація"
								multiline
								rows={3}
								value={formData.description}
								onChange={handleChange('description')}
							/>
						</Grid>

						<Grid item xs={12}>
							<Box
								sx={{
									border: '2px dashed',
									borderColor: errors.pdf ? 'error.main' : 'primary.main',
									borderRadius: 2,
									p: 2,
									textAlign: 'center',
									backgroundColor: 'grey.50',
								}}
							>
								<Typography variant="subtitle1" gutterBottom>
									PDF версія сертифікату (опціонально)
								</Typography>

								{!pdfFile ? (
									<>
										<input
											accept="application/pdf"
											style={{ display: 'none' }}
											id="pdf-upload-button"
											type="file"
											onChange={handlePdfUpload}
										/>
										<label htmlFor="pdf-upload-button">
											<Button
												variant="outlined"
												component="span"
												startIcon={<UploadFileIcon/>}
											>
												Завантажити PDF
											</Button>
										</label>
										<Typography variant="caption" display="block" sx={{ mt: 1 }}>
											Максимальний розмір: 10MB
										</Typography>
									</>
								) : (
									<Box sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 1
									}}>
										<Chip
											icon={<PictureAsPdfIcon/>}
											label={pdfFile.name}
											color="primary"
											onDelete={handleRemovePdf}
											deleteIcon={<CloseIcon/>}
										/>
										<Typography variant="caption" color="text.secondary">
											{(pdfFile.size / 1024).toFixed(2)} KB
										</Typography>
									</Box>
								)}

								{errors.pdf && (
									<Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
										{errors.pdf}
									</Typography>
								)}
							</Box>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Скасувати</Button>
					<Button onClick={handleSubmit} variant="contained">
						Видати сертифікат
					</Button>
				</DialogActions>
			</Dialog>

			<ConfirmDialog
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={handleConfirm}
				title="Підтвердження видачі сертифікату"
				message={
					<Box>
						<Typography>Ви впевнені, що хочете видати сертифікат з наступними даними?</Typography>
						<Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
							<Typography variant="body2"><strong>Отримувач:</strong> {formData.recipientName}
							</Typography>
							<Typography variant="body2"><strong>Курс:</strong> {formData.courseName}</Typography>
							<Typography variant="body2"><strong>Тип:</strong> {
								certificateTypes.find(t => t.value === formData.certificateType)?.label
							}</Typography>
							{pdfFile && (
								<Typography variant="body2"><strong>PDF:</strong> {pdfFile.name}</Typography>
							)}
						</Box>
					</Box>
				}
				confirmText="Підтвердити видачу"
				cancelText="Скасувати"
			/>
		</>
	);
};

export default IssueCertificateForm;