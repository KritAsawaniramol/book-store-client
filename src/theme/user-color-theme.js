import { createTheme, responsiveFontSizes } from '@mui/material';
import { useMemo } from 'react';
import { getDesignTokens } from './Theme';

export const useColorTheme = () => {
    const t = createTheme(getDesignTokens())
    const modifiedTheme = useMemo(() => 
        responsiveFontSizes(t), 
        [t]
    )
    return {
        theme: modifiedTheme,
    }
}