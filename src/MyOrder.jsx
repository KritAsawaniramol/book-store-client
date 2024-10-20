import { ThemeProvider } from '@mui/material/styles';
import {  Container, CssBaseline } from "@mui/material"
import ResponsiveAppBar from './ResponsiveAppBar';
import { useThemeContext } from './theme/ThemeContextProvider';
import OrderTabel from './OrderTable';



export default function MyOrder() {
    const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <ResponsiveAppBar />
      <Container>
        <OrderTabel />
      </Container>
      </ThemeProvider>
  )
}
