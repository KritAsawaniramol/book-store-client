import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Box, IconButton } from '@mui/material';
import { useThemeContext } from './theme/ThemeContextProvider';

function NightModeToggle() {
    const {toggleColorMode, mode} = useThemeContext()

    // const getNextMode = (premode) => {
    //     console.log("getNextMode");
    //     console.log(premode);
    //     if (premode === "system") {
    //         return "light"
    //     } else if(premode === "light") {
    //         return "dark"
    //     } else {
    //         return "system"
    //     }
    // } 
    // const {mode, toggleColorMode} = useThemeContext();
    const renderIcon = (mode) => {
      if (mode === "light") {
        return <LightModeIcon></LightModeIcon>
      } else if (mode === "dark") {
        return <DarkModeIcon></DarkModeIcon>
      } else {
        return <Brightness4Icon></Brightness4Icon>
      }
    } 
    return (
    <Box
    sx={{
      color: "text.primary",
    }} >
        <IconButton
        onClick={
            // const nextMode = getNextMode(mode)
            // console.log(nextMode);
            // setMode(nextMode)}
            toggleColorMode(mode)
        }
        >
             {renderIcon(mode)}
        </IconButton>
    </Box>
  )
}

export default NightModeToggle