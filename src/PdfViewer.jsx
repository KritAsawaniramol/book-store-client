import PropTypes from 'prop-types'
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { sendBookProtectedReq } from './api/useApi';

function PdfViewer(props) {
    const { bookID } = props
    const [pdfUrl, setPdfUrl] = useState('');
    const fetchBook = () => {
        console.log(bookID);
        sendBookProtectedReq.get(`/book/read/${bookID}`, { responseType: 'blob' })
            .then((res) => {
                console.log(res.data);
                const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                console.log(pdfUrl);
                setPdfUrl(pdfUrl);
            })
            .catch((err) => {
                console.error(err.response);
            })
    }

    useEffect(() => {
        fetchBook()
    }, [])
    return (
        <>
            {pdfUrl ?
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    < Box height={'100vh'} sx={{ overflowY: 'scroll' }}>
                        <Box
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                overflow: 'hidden',
                                '& .rpv-core__inner-page': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                },
                            }}
                        >
                            <Viewer fileUrl={pdfUrl} defaultScale={SpecialZoomLevel.PageWidth} />
                        </Box>
                    </Box >
                </Worker >
                : (
                    <p>Loading PDF...</p>
                )}
        </>
    )
}

PdfViewer.propTypes = {
    bookID: PropTypes.number
}

export default PdfViewer
