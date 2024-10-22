import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { addBookToCart, getCart, getCountItemInCart } from './cart';
import { useCart } from './CartContext';
import { sendOrderProtectedReq } from './api/useApi';


export default function AddToCartModal(props) {
    const { open, handleClose, bookCoverImageUrl, bookID } = props
    const {setCountItemInCart} = useCart()
    const handleAddToCart = () => {
        sendOrderProtectedReq.get(`/order/myorder?book_id=${bookID}`).
        then((res) => {
            if (res.data == null) {
                const cart = getCart()
                if (cart.includes(bookID)) {
                  alert("this book already in your cart.")
                  handleClose()
                    return
                }
                addBookToCart(bookID)
                setCountItemInCart(getCountItemInCart())
                handleClose()
                return
            } else {
                alert("this book already in your order.")
                handleClose()
            }
        }).
        catch((err) => {alert(err.response)})    
    }


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderRadius: '10px',
            alignItems: 'center'
          }}>
            <Typography  variant="h6" fontWeight={'bold'} width={'300px'} >
              Do you want to add this book to your cart?
            </Typography>
            <Box
            component={'img'}
            src={`${import.meta.env.VITE_BOOK_SERVER_API_URL}${bookCoverImageUrl}`}
            sx={{ height: 200, objectFit: 'contain', display: 'block' }}
            ></Box>
            <Box display={'flex'}  gap={"10px"}>
            <Button variant='contained' color='success' onClick={handleAddToCart}>Yes</Button>
            <Button variant='contained' color='error' onClick={handleClose}>Cancel</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

AddToCartModal.propTypes = {
    bookID: PropTypes.number,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    bookCoverImageUrl: PropTypes.string
}