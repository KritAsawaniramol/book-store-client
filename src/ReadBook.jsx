import { useParams } from "react-router-dom";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { ThemeProvider } from "@emotion/react";
import { Box, Chip, CircularProgress, Container, CssBaseline, Paper, Typography } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";

import PdfViewer from "./PdfViewer";
import { useEffect, useState } from "react";
import { sendBookPublicReq } from "./api/useApi";



export default function ReadBook() {
    let { bookID } = useParams();
    const [book, setBook] = useState();
    const { theme } = useThemeContext();
    const fetchData = () => {
        sendBookPublicReq.get(`/book/${bookID}`)
            .then((res) => { setBook(res.data) })
            .catch((err) => { console.log(err.response); })
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ResponsiveAppBar />
            <Container>
                <Paper sx={{ padding: '20px' }}>
                    {
                        book ?
                            <Box display={'flex'} padding={'20px'} >
                                <Box
                                    component={'img'}
                                    sx={{ height: 200, maxHeight: 250, objectFit: 'contain' }}
                                    src={book.cover_image_url}
                                ></Box>
                                <Box ml={'20px'} display={'flex'} flexDirection={'column'} gap={'10px'} >
                                    <Typography>Title: {book.title}</Typography>
                                    <Box display={'flex'} flexWrap={'wrap'} alignItems={'center'}>
                                        <Typography>Tags: </Typography>
                                        {
                                            book.tags.map((t, tIdx) => {
                                                return (
                                                    <Chip key={tIdx} label={t.name} size="small" sx={{ margin: '5px' }} />
                                                )
                                            })
                                        }
                                    </Box>
                                    <Typography>Description: {book.description}</Typography>
                                </Box>
                            </Box>
                            : <CircularProgress />
                    }

                    <PdfViewer bookID={bookID} />
                </Paper>
            </Container>
        </ThemeProvider>
    )
}
