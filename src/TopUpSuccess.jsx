import ResponsiveAppBar from "./ResponsiveAppBar";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { Box, Button, Container, CssBaseline, Paper, ThemeProvider, Typography } from "@mui/material";
import checkmarkAnimation from './assets/checkmark.json';
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";


export default function TopUpSuccess() {
    const { theme } = useThemeContext();
    const nav = useNavigate()
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <ResponsiveAppBar />
    <Container>
        <Paper variant="outlined" sx={{
            p: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
        <Box sx={{ width: 150, height: 150 }}>
            <Lottie animationData={checkmarkAnimation} loop={false} />
        </Box>
            <Typography variant="h3" fontWeight={'bold'} textAlign={'center'}>
                TOP-UP SUCCESSFUL!
            </Typography>
            <Typography variant="h5" color="text.disabled" textAlign={'center'}>
                Click the button below to return to Homepage.
            </Typography>
            <Button variant="contained" sx={{width: '200px'}} onClick={() => nav("/")}>Back to Homepage</Button>
        </Paper>
    </Container>
    </ThemeProvider>
  )
}
