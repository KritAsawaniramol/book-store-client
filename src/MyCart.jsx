import { useThemeContext } from "./theme/ThemeContextProvider";
import { Box, Button, Container, CssBaseline, Grid2 as Grid, Paper, Typography } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { getCart, getCountItemInCart, removeBookFromCart, setCart } from "./cart";
import './MyCart.css';
import CartItem from "./CartItem";
import { useState } from "react";
import { sendOrderProtectedReq } from "./api/useApi";
import { useCart } from "./CartContext";
import { ThemeProvider } from '@mui/material/styles';
import { THB } from "./textFormat";
import { useNavigate } from "react-router-dom";

function MyCart() {

    const {setCountItemInCart} = useCart()


    const [items, setItems] = useState(getCart() || [])

    const [itemPrice, setItemPrice] = useState(getCart() ? Array(getCart().length).fill(0) : [])
    const [total, setTotal] = useState(0)

    const { theme } = useThemeContext();
    const nav = useNavigate()

    const handleRemoveItem = (idx) => {
        itemPrice.splice(idx, 1)
        setItemPrice(itemPrice)
        let sum = 0
        for (let i = 0; i < itemPrice.length; i++) {
            sum += itemPrice[i];
        }
        setTotal(sum)
        removeBookFromCart(idx)
        const newCart = getCart()
        setItems(newCart)
        setCountItemInCart(getCountItemInCart())

    }
    const handleCheckout = () => {
        if (getCountItemInCart() > 0) {
        sendOrderProtectedReq.post("/order/buy", {"books": getCart()}).
        then(() => {
            setCart([])
            nav("/myorder")
        }).
        catch((err) => {console.log(err.response);})
    }
    }


    const addTotal = (cartIdx, price) => {
        console.log(`${cartIdx}: ${price}`);
        itemPrice[cartIdx] = price
        setItemPrice(itemPrice)
        let sum = 0
        for (let i = 0; i < itemPrice.length; i++) {
            sum += itemPrice[i];
        }
        setTotal(sum)
    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ResponsiveAppBar />
            <Container>
                <Box padding={'20px'}
                    sx={{
                        '@media (max-width:900px)': {
                            overflowX: 'scroll',
                        }
                    }}
                >
                    <Paper elevation={3} sx={{
                        borderRadius: '20px',
                        minWidth: '766px',
                        minHeight: '200px'
                    }}  >
                        <Grid container>
                            <Grid size={6} borderRadius={'20px 0 0 0'} 
                             className="tableFields" bgcolor={theme.palette.secondary.light}>
                                <Typography variant="h5" fontWeight={'bold'} >Item</Typography>
                            </Grid>
                            <Grid size={1} className="tableFields" bgcolor={theme.palette.secondary.light} >
                                <Typography variant="h5" fontWeight={'bold'}>Qty.</Typography>
                            </Grid>
                            <Grid size={3} className="tableFields" bgcolor={theme.palette.secondary.light}>
                                <Typography variant="h5" fontWeight={'bold'}>Price</Typography>
                            </Grid>
                            <Grid size={2} borderRadius={' 0 20px 0 0'} className="tableFields" bgcolor={theme.palette.secondary.light}>
                            </Grid>
                            {
                                items.map((id, idx) => {
                                    console.log(`render: id = ${id}`);
                                    return (
                                        <CartItem key={idx} bookID={id} cartIdx={idx} handleRemoveItemFunc={handleRemoveItem} addTotalFunc={addTotal} />
                                    )
                                }
                                )
                            }
                        </Grid>
                        <Box>
                        </Box>
                    </Paper>
                </Box>
                <Box display={'flex'} gap={"15px"} flexDirection={'column'} alignItems={'flex-end'} padding={'30px'} paddingBottom={'30px'}>
                    <Typography variant="h4">{items.length} Items</Typography>
                    <Typography variant="h4" fontWeight={'bold'}>{THB.format(total)}</Typography>
                    <Button 
                    variant="contained" 
                    sx={{ fontWeight: 'bold', width: "200px" }} 
                    onClick={handleCheckout}>
                        Checkout</Button>
                </Box>
            </Container>
        </ThemeProvider>

    )
}



export default MyCart