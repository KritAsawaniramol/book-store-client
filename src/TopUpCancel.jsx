import ResponsiveAppBar from "./ResponsiveAppBar";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { Box, Button, Container, CssBaseline, Paper, ThemeProvider, Typography } from "@mui/material";
import failed from './assets/failed.json'; // Path to your JSON animation file
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

export default function TopUpCancel() {

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
            <Lottie animationData={failed} loop={false} />
        </Box>
            <Typography variant="h3" fontWeight={'bold'} textAlign={'center'}>
            YOUR TOP-UP REQUEST FAILED!
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
