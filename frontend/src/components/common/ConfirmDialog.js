import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@mui/material';

const ConfirmDialog = ({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Підтвердити',
	cancelText = 'Скасувати',
}) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="confirm-dialog-title"
		>
			<DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="inherit">
					{cancelText}
				</Button>
				<Button onClick={onConfirm} variant="contained" autoFocus>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;