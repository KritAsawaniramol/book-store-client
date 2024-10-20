export const getDesignTokens = () => ({
    breakpoints: {
        values: {
            xxs: 0,
            xs: 450,
            sm: 600,
            smmd: 750,
            md: 900,
            lg: 1200,
            xl: 1536,
        }
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    },
    colorSchemes: {
        // dark: true,
        light: {
            palette: {
                primary: {
                    main: '#82ffa1',
                    contrastText: "#000"
                },
            }
        },
        dark: {
            mode: "dark",
            palette: {
                background: {
                    default: "#222222"
                },
              
            }
        }
    },
})