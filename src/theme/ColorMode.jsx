import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';

export function ColorModeSelect(props) {
    const { mode, setMode } = useColorScheme();

    if (!mode) {
        return null;
    }
    return (
        <Select
            value={mode}
            sx={{
                '& .MuiSelect-select': {
                    paddingY: '10px'
                }
            }}
            onChange={(event) =>
                setMode(event.target.value)
            }
            SelectDisplayProps={{
                // @ts-ignore
                'data-screenshot': 'toggle-mode',
            }}
            {...props}
        >
            <MenuItem value="system">System</MenuItem>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
        </Select>
    );
}

export function ColorModeList() {
    const { mode, setMode } = useColorScheme();

    if (!mode) {
        return null;
    }
    return (
    <List component="div" disablePadding>
        <ListItemButton  onClick={() => setMode("system")}>
            <ListItemIcon>
                <Brightness4Icon />
            </ListItemIcon>
            <ListItemText primary="System" />
        </ListItemButton>
        <ListItemButton  onClick={() => setMode("light")}>
            <ListItemIcon>
                <LightModeIcon />
            </ListItemIcon>
            <ListItemText primary="Light" />
        </ListItemButton>
        <ListItemButton  onClick={() => setMode("dark")}>
            <ListItemIcon>
                <DarkModeIcon />
            </ListItemIcon>
            <ListItemText primary="Dark" />
        </ListItemButton>
    </List>
    )
}
