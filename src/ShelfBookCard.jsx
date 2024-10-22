import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useThemeContext } from './theme/ThemeContextProvider';
import { Link } from 'react-router-dom';

export default function ShelfBookCard(props) {
    const { name, author, bookCoverImageUrl, id } = props

    const {theme} = useThemeContext()

    return (
        <>
            <Card variant='outlined'  
            sx={{
                position: 'relative', 
                maxWidth: "220px", maxHeight: "290px", aspectRatio: '2.2/4',
                '&:hover' : {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '3px'
                }
                }}>
                    <Link to={`/readbook/${id}`}>
                <CardMedia
                    component={'img'}
                    sx={{ height: 200, maxHeight: 250, objectFit: 'contain' }}
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
            </Card>
           
        </>
    );
}

ShelfBookCard.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    author: PropTypes.string,
    bookCoverImageUrl: PropTypes.string,
    openSignin: PropTypes.func,
}
