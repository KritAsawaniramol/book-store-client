import { Box, Button, Chip, Container, CssBaseline, Paper, ThemeProvider, Typography } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { sendBookPublicReq } from "./api/useApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import AddToCartModal from "./AddToCartModal";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function Book() {
    const { theme } = useThemeContext();
    let { bookID } = useParams();
    const [book, setBook] = useState();
    const [openSignIn, setOpenSignin] = useState(false);
    const [openAddToCart, setOpenAddToCart] = useState(false)
    const handleUnauthenticatedBuy = () => {
        setOpenSignin(true)
    }
    const handleCloseAddToCart = () => setOpenAddToCart(false)

    const fetchData = () => {
        sendBookPublicReq.get(`/book/${bookID}`)
            .then((res) => {
                console.log(res.data);
                setBook(res.data)
            })
            .catch((err) => {
                alert(err.response.data.message)
                console.log(err);
            })
    }
    useEffect(() => {
        fetchData()
    }, [])

    const { isAuthenticated } = useAuth()
    const handleOpenAddToCart = () => {
        console.log("setOpenAddToCart(true)");
        setOpenAddToCart(true)
    }



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ResponsiveAppBar
                openSignInFromOutSide={openSignIn}
                setOpenSignInFromOutSide={setOpenSignin}
            />
            <Container maxWidth='md'>
                {
                    book &&
                    <Box >
                        <Typography variant="h2" textAlign={'center'} fontWeight={"bold"}>{book.title || ""}</Typography>
                        <Box minHeight={'100vh'}>


                            <Box display={'flex'} sx={{
                                [theme.breakpoints.down('smmd')]: {
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }
                            }}>
                                <Box display={'flex'} flexDirection={'column'} >
                                    <Paper
                                        component={'img'}
                                        src={book.cover_image_url}
                                        elevation={3}

                                        sx={{ borderRadius: 0, height: 300, objectFit: 'contain', aspectRatio: '2.2/3' }}
                                    ></Paper>
                                    <Button
                                        size="small"

                                        variant='contained'
                                        onClick={isAuthenticated === true ? handleOpenAddToCart : handleUnauthenticatedBuy}
                                    >
                                        <MonetizationOnIcon fontSize='small' sx={{ mr: '5px' }} />
                                        <Typography variant='caption' fontWeight={'bold'} >
                                            {(book.price).toLocaleString()}
                                        </Typography>
                                    </Button>
                                </Box>

                                <Box padding={'20px'} display={'flex'} gap={"20px"} flexDirection={'column'}
                                >
                                    <Box display={'flex'} flexWrap={'wrap'}>
                                        {
                                            book.tags.map((t, tIdx) => {
                                                return (
                                                    <Chip key={tIdx} label={t.name} sx={{ margin: '5px' }} />
                                                )
                                            })
                                        }
                                    </Box>

                                    <Typography><Typography fontWeight={'bold'} display={'inline'}>Author:</Typography> {book.author_name || ""}</Typography>
                                    <Typography><Typography fontWeight={'bold'} display={'inline'}>Description:</Typography> {book.description || ""}</Typography>

                                </Box>
                                <AddToCartModal bookCoverImageUrl={book.cover_image_url} open={openAddToCart} handleClose={handleCloseAddToCart} bookID={book.id} />
                            </Box>
                        </Box>
                    </Box>
                }
            </Container>
        </ThemeProvider>
    )
}
