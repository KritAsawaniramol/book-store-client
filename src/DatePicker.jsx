import * as React from 'react';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

export default function DatePicker(props) {
  const {label, setDate} = props
  const [cleared, setCleared] = React.useState(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);
  const handleClear = () => {
    setCleared(true)
    setDate()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: '100%',
        }}
      >
        <DemoItem label={label}>
          <DesktopDatePicker
            sx={{ width: 260 }}
            slotProps={{
              field: { clearable: true, onClear: () => {
                handleClear()
            } },
            }}
            defaultValue={null} 
            onChange={(newValue) => setDate(newValue)}
          />
        </DemoItem>

        {cleared && (
          <Alert
            sx={{ position: 'absolute', bottom: 0, right: 0 }}
            severity="success"
          >
            Field cleared!
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
}

DatePicker.propTypes = {
  label: PropTypes.string,
  setDate: PropTypes.func,
};