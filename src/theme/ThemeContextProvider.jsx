import { createContext, useContext } from "react";
import { createTheme } from "@mui/material";
import { useColorTheme } from "./user-color-theme";
import PropTypes from 'prop-types';

export const ThemeContext = createContext({
    mode: 'light',
    toggleColorMode: () => {},
    theme: createTheme()
})


export const useThemeContext = () => {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
        throw new Error("useThemeContext must be within ThemeContextProvider")
    }
    return ctx
}

export const ThemeContextProvider = ({ children }) => {
    const value = useColorTheme();
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

ThemeContextProvider.propTypes = {
    children: PropTypes.element
}

