import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminPage from './pages/AdminPage';
import IssuerPage from './pages/IssuerPage';
import CertificatePage from './pages/CertificatePage';
import ValidationPage from './pages/ValidationPage';

function App() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header/>
			<Box component="main" sx={{ flexGrow: 1, py: 3 }}>
				<Routes>
					<Route path="/" element={<ValidationPage/>}/>
					<Route path="/admin" element={<AdminPage/>}/>
					<Route path="/issuer/:issuerId" element={<IssuerPage/>}/>
					<Route path="/certificate/:certificateId" element={<CertificatePage/>}/>
					<Route path="/validate" element={<ValidationPage/>}/>
				</Routes>
			</Box>
			<Footer/>
		</Box>
	);
}

export default App;