import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
	return (
		<AppBar position="static" elevation={2}>
			<Toolbar>
				<VerifiedIcon sx={{ mr: 2 }}/>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Система Сертифікації
				</Typography>
				<Box>
					<Button
						color="inherit"
						component={RouterLink}
						to="/validate"
						startIcon={<SearchIcon/>}
					>
						Валідація
					</Button>
					<Button
						color="inherit"
						component={RouterLink}
						to="/admin"
						startIcon={<AdminPanelSettingsIcon/>}
					>
						Адміністрування
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;