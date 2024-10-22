import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useThemeContext } from './theme/ThemeContextProvider';
import { Link } from 'react-router-dom';

export default function AdminBookCard(props) {
    const { name, author, bookCoverImageUrl, id, isAvailable } = props


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
                <Link to={`/admin/updatebook/${id}`}>
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

                <CardContent sx={{  padding: '8px', paddingBottom: '0px', position: 'relative' }}>
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
                <Typography
                        fontSize={'15px'}
                        border={"1px solid"}
                        width={'fit-content'}
                        paddingX={'5px'}
                        borderRadius={"15px"}
                        position={'absolute'}
                        bottom={'5px'}
                        right={'5px'}
                        color={isAvailable ? "success" : "error"}
                    >Status: {isAvailable ? "True" : "False"}
                    </Typography>
            </Card>
        </>
    );
}

AdminBookCard.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    author: PropTypes.string,
    price: PropTypes.number,
    bookCoverImageUrl: PropTypes.string,
    setOpenSignin: PropTypes.func,
    isAvailable: PropTypes.bool
}
