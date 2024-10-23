import PropTypes from 'prop-types'
import { Box, Chip, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { sendBookPublicReq } from './api/useApi';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { useThemeContext } from './theme/ThemeContextProvider';
import { THB } from './textFormat';

function CartItem(props) {
    const { bookID, cartIdx, handleRemoveItemFunc, addTotalFunc } = props
    const [isLoading, setIsLoading] = useState(true)

    const [book, setBook] = useState()

    useEffect(() => {
        fetchBookData()
    }, [bookID])

    useEffect(() => {
        fetchBookData()
    }, [])


    const fetchBookData = () => {
        setIsLoading(true)
        sendBookPublicReq.get(`/book/${bookID}`).
            then((res) => {
                setBook(res.data)
                addTotalFunc(cartIdx, res.data.price)
            }).catch((err) => { console.log(err.response); })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const { theme } = useThemeContext();



    return (
        <>
            {
                isLoading ? <CircularProgress /> :
                    <Grid size={12}  >
                        <Box borderTop={cartIdx !== 0 && '2px solid'} borderColor={theme.palette.grey[500]}>
                            <Grid container >
                                <Grid size={6} p={'20px'} className={'colBorder'}>
                                    <Typography fontSize={'15px'} fontWeight={'bold'} margin={0} sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                    }}>
                                        {book?.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 1,
                                    }}>
                                        {book.author_name}
                                    </Typography>
                                    <Box display={'flex'} gap={'10px'}>
                                        <Box
                                            component={'img'}
                                            sx={{ maxWidth: "150px", maxHeight: "200px", aspectRatio: '2.2/3', objectFit: 'contain' }}
                                            src={`${import.meta.env.VITE_BOOK_SERVER_API_URL}${book.cover_image_url}`}
                                        >
                                        </Box>
                                        <Box display={'flex'} flexWrap={'wrap'}>
                                            {
                                                book.tags.map((t, tIdx) => {
                                                    return (
                                                        <Chip key={tIdx} label={t.name} size="small" sx={{ margin: '5px' }} />
                                                    )
                                                })
                                            }
                                        </Box>
                                    </Box>

                                </Grid>
                                <Grid size={1} p={'10px'} className={'colBorder'}>
                                    <Box display={'flex'} height={'100%'} justifyContent={'right'} alignItems={'center'}>

                                        <Typography textAlign={'right'} >{1}</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={3} p={'10px'} className={'colBorder'}>
                                    <Box display={'flex'} height={'100%'} justifyContent={'right'} alignItems={'center'}>
                                        <Typography  >{THB.format(book.price)}</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <IconButton aria-label="delete" sx={{ height: 'fit-content' }} onClick={() => handleRemoveItemFunc(cartIdx)}>
                                        <DeleteIcon fontSize="large" color="error" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
            }
        </>
    )
}

CartItem.propTypes = {
    bookID: PropTypes.number,
    cartIdx: PropTypes.number,
    handleRemoveItemFunc: PropTypes.func,
    addTotalFunc: PropTypes.func
}

export default CartItem
