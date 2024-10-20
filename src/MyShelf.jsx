import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Container, CssBaseline, Grid2, Typography } from "@mui/material"
import ResponsiveAppBar from './ResponsiveAppBar';
import { useThemeContext } from './theme/ThemeContextProvider';
import { useEffect, useState } from 'react';
import { sendShelfProtectedReq } from './api/useApi';
import ShelfBookCard from './ShelfBookCard';

export default function MyShelf() {
    const { theme } = useThemeContext();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoadding] = useState(true);
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setIsLoadding(true)
        sendShelfProtectedReq.get("/shelf")
            .then((res) => {
                console.log(res.data.shelves)
                setBooks(res.data.shelves)
            })
            .catch((err) => alert(err.response))
            .finally(() => setIsLoadding(false))
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ResponsiveAppBar />
            <Container>
                <Typography variant='h3' fontWeight={'bold'}>My Shelf</Typography>
                <hr />
                {
                    isLoading ? <CircularProgress /> :
                            <Grid2 container spacing={2} mt={"20px"}>
                                {
                                    books.map((b, i) =>
                                        <Grid2
                                            key={i}
                                            size={{ xxs: 6, xs: 6, sm: 4, smmd: 3, md: 2.4, lg: 2.4 }}
                                            justifyContent={'center'}
                                            display={'flex'}
                                        >
                                            <ShelfBookCard
                                                id={b.book.book_id}
                                                name={b.book.title}
                                                author={b.book.author_name}
                                                bookCoverImageUrl={b.book.cover_image_url}
                                            />
                                        </Grid2>
                                    )
                                }
                            </Grid2>
                        
                }
            </Container>
        </ThemeProvider>
    )
}
