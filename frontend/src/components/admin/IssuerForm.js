import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControlLabel,
	Switch,
	Grid,
} from '@mui/material';

const IssuerForm = ({ open, onClose, onSubmit, issuer = null }) => {
	const [ formData, setFormData ] = useState({
		name: '',
		did: '',
		email: '',
		description: '',
		active: true,
	});

	const [ errors, setErrors ] = useState({});

	useEffect(() => {
		if (issuer) {
			setFormData(issuer);
		} else {
			setFormData({
				name: '',
				did: '',
				email: '',
				description: '',
				active: true,
			});
		}
		setErrors({});
	}, [ issuer, open ]);

	const validate = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Назва є обов'язковою";
		}

		if (!formData.did.trim()) {
			newErrors.did = "DID є обов'язковим";
		} else if (!formData.did.startsWith('did:')) {
			newErrors.did = "DID має починатися з 'did:'";
		}

		if (formData.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
			newErrors.email = 'Невірний формат email';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validate()) {
			onSubmit(formData);
			onClose();
		}
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
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				{issuer ? 'Редагувати емітента' : 'Додати нового емітента'}
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Назва"
							value={formData.name}
							onChange={handleChange('name')}
							error={!!errors.name}
							helperText={errors.name}
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="DID (Decentralized Identifier)"
							value={formData.did}
							onChange={handleChange('did')}
							error={!!errors.did}
							helperText={errors.did || "Приклад: did:ethr:0x..."}
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Email"
							type="email"
							value={formData.email}
							onChange={handleChange('email')}
							error={!!errors.email}
							helperText={errors.email}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Опис"
							multiline
							rows={3}
							value={formData.description}
							onChange={handleChange('description')}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControlLabel
							control={
								<Switch
									checked={formData.active}
									onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
									color="primary"
								/>
							}
							label="Активний"
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Скасувати</Button>
				<Button onClick={handleSubmit} variant="contained">
					{issuer ? 'Зберегти' : 'Створити'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default IssuerForm;