import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DownloadIcon from '@mui/icons-material/Download';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString();

const PdfViewer = ({ pdfData }) => {
	const [ numPages, setNumPages ] = useState(null);
	const [ pageNumber, setPageNumber ] = useState(1);
	const [ pdfBlob, setPdfBlob ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(null);

	function base64ToBytes(base64) {
		const binary = atob(base64);
		const len = binary.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	}

	useEffect(() => {
		if (pdfData) {
			try {
				const uint8Array = base64ToBytes(pdfData);
				const blob = new Blob([ uint8Array ], { type: 'application/pdf' });
				setPdfBlob(blob);
				setLoading(false);
			} catch (err) {
				console.error('Помилка конвертації PDF:', err);
				setError('Не вдалося завантажити PDF');
				setLoading(false);
			}
		}
	}, [ pdfData ]);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
		setPageNumber(1);
	};

	const onDocumentLoadError = (error) => {
		console.error('Помилка завантаження документа:', error);
		setError('Помилка завантаження PDF документа');
	};

	const goToPrevPage = () => {
		setPageNumber((prev) => Math.max(prev - 1, 1));
	};

	const goToNextPage = () => {
		setPageNumber((prev) => Math.min(prev + 1, numPages));
	};

	const downloadPdf = () => {
		if (pdfBlob) {
			const url = URL.createObjectURL(pdfBlob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'certificate.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
				<CircularProgress/>
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity="error" sx={{ m: 2 }}>
				{error}
			</Alert>
		);
	}

	return (
		<Paper elevation={2} sx={{ p: 2 }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Box
					sx={{
						border: '1px solid',
						borderColor: 'grey.300',
						borderRadius: 1,
						overflow: 'hidden',
						mb: 2,
					}}
				>
					<Document
						file={pdfBlob}
						onLoadSuccess={onDocumentLoadSuccess}
						onLoadError={onDocumentLoadError}
						loading={
							<Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
								<CircularProgress/>
							</Box>
						}
					>
						<Page
							pageNumber={pageNumber}
							renderTextLayer={true}
							renderAnnotationLayer={true}
							width={Math.min(window.innerWidth * 0.8, 800)}
						/>
					</Document>
				</Box>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Button
							variant="outlined"
							size="small"
							onClick={goToPrevPage}
							disabled={pageNumber <= 1}
							startIcon={<NavigateBeforeIcon/>}
						>
							Попередня
						</Button>
						<Typography variant="body2" sx={{ mx: 2 }}>
							Сторінка {pageNumber} з {numPages}
						</Typography>
						<Button
							variant="outlined"
							size="small"
							onClick={goToNextPage}
							disabled={pageNumber >= numPages}
							endIcon={<NavigateNextIcon/>}
						>
							Наступна
						</Button>
					</Box>

					<Button
						variant="contained"
						size="small"
						onClick={downloadPdf}
						startIcon={<DownloadIcon/>}
					>
						Завантажити PDF
					</Button>
				</Box>
			</Box>
		</Paper>
	);
};

export default PdfViewer;