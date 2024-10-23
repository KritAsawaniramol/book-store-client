import { Box, Card, CardActionArea, CardContent, Container, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { useThemeContext } from "./theme/ThemeContextProvider";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { THB } from "./textFormat";
import { sendUserProtectedReq } from "./api/useApi";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";



export default function TopUp() {
    const { theme } = useThemeContext();
    const packageList = [
        {
            coin: 10,
            price: 10
        },
        {
            coin: 20,
            price: 20
        },
        {
            coin: 30,
            price: 30
        },
        {
            coin: 100,
            price: 100
        },
        {
            coin: 150,
            price: 150
        },
        {
            coin: 200,
            price: 200
        },
    ]

    
    const fetchUserBalance = () => {
        sendUserProtectedReq.get("/user/balance")
        .then((res) => setCoin(res.data.balance))
        .catch((err) => console.log(err.response.data.message))
    }
    
    useEffect(() => {
        fetchUserBalance()
    },[])

    const [coin, setCoin] = useState(0)
    
    const handleOnClick = (price) => {
        sendUserProtectedReq.post("/user/top-up", { amount: Number(price) })
            .then((res) => {
                const sessionID = res.data.sessionID
                console.log(sessionID);
                loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
                    .then((stripe) => {
                        stripe.redirectToCheckout({ sessionId: sessionID })
                    })
                    .catch((err2) => { console.log(err2); })
            })
            .catch((err) => { console.log(err); })
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ResponsiveAppBar />
            <Container >
                <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
                    <Box width={'400px'} height={'100px'} display={'flex'} gap={'10px'} alignItems={'center'} justifyContent={'center'} border={'2px solid'} padding={'20px'} borderRadius={'10px'} >
                        <Typography variant="h5">My Coin: </Typography>
                        <MonetizationOnIcon fontSize="large" />
                        <Typography variant="h5">{coin}</Typography>
                    </Box>
                    <Box display={'flex'} mt={'50px'} flexWrap={'wrap'} gap={'20px'} justifyContent={'center'} >
                        {
                            packageList.map((p, idx) => (
                                <Card key={idx} elevation={5}

                                    sx={{
                                        width: '200px', borderRadius: '20px', display: 'flex',
                                        flexDirection: 'column', justifyContent: 'center', gap: '20px',
                                        minWidth: '200px',
                                        "&:hover": { boxShadow: 10 }
                                    }}
                                >
                                    <CardActionArea onClick={() => handleOnClick(p.price)}>
                                        <CardContent>

                                            <Box display={'flex'} gap={'10px'} alignItems={'center'} justifyContent={'center'}>
                                                <MonetizationOnIcon fontSize="large" />
                                                <Typography variant="h2" fontWeight={'bold'}>{p.coin}</Typography>
                                            </Box>
                                            <Typography textAlign={'center'} color="text.disabled" fontWeight={'bold'}>{THB.format(p.price)}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))
                        }
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
