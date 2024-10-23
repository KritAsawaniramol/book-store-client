import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useAuth } from './auth/AuthContext';
import AddToCartModal from './AddToCartModal';
import { useState } from 'react';
import { useThemeContext } from './theme/ThemeContextProvider';
import { Link } from 'react-router-dom';
export default function BookCard(props) {
    const { name, author, price, setOpenSignin, bookCoverImageUrl, id } = props
    const { isAuthenticated } = useAuth()
    const [openAddToCart, setOpenAddToCart] = useState(false)
    const handleUnauthenticatedBuy = () => {
        setOpenSignin(true)
    }
    const handleOpenAddToCart = () => {
        setOpenAddToCart(true)
    }
    const handleCloseAddToCart = () => setOpenAddToCart(false)

    const { theme } = useThemeContext()
    return (
        <>
            <Card variant='outlined' sx={{
                position: 'relative',
                maxWidth: "220px",
                width: '100%',
                height: "320px",
                aspectRatio: '2.2/4.3',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '3px'
                },
            }}>
                <Link to={`/book/${id}`}>
                    <CardMedia
                        component={'img'}
                        sx={{ 
                            height: 200, 
                            maxHeight: 250, 
                            minWidth: '160px', 
                            objectFit: 'contain', 
                        }}
                        src={`${import.meta.env.VITE_BOOK_SERVER_API_URL}${bookCoverImageUrl}`}
                    />
                </Link>

                <CardContent sx={{ padding: '8px', paddingBottom: '0px' }}>
                    <Typography fontSize={'15px'} fontWeight={'bold'} margin={0} sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                    }}>
                        {name}
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                    }}>
                        {author}
                    </Typography>
                </CardContent>
                <CardActions sx={{ pb: 0, position: 'absolute', bottom: '7px', right: 0 }}>
                    <Box display={'flex'} flexDirection={'row-reverse'} width={'100%'}>
                        <Button 
                        size="small" 
                        variant='contained' 
                        onClick={isAuthenticated === true ? handleOpenAddToCart : handleUnauthenticatedBuy} 
                        >
                            <MonetizationOnIcon fontSize='small' sx={{ mr: '5px' }} />
                            <Typography variant='caption' fontWeight={'bold'}>{(price).toLocaleString()}</Typography>
                        </Button>
                    </Box>
                </CardActions>
            </Card>
            <AddToCartModal bookCoverImageUrl={bookCoverImageUrl} open={openAddToCart} handleClose={handleCloseAddToCart} bookID={id} />
        </>
    );
}

BookCard.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    author: PropTypes.string,
    price: PropTypes.number,
    bookCoverImageUrl: PropTypes.string,
    setOpenSignin: PropTypes.func,
}
