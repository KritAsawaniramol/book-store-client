import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import PropTypes from 'prop-types'

export default function BookAvailableRaioButtons(props) {
  const { value , setValue } = props

  const handleChange = (event) => {
    setValue(event.target.value === "true");
  };

  return (
    <FormControl>
      <FormLabel>Status</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value={true} control={<Radio />} label="True" />
        <FormControlLabel value={false}  control={<Radio />} label="False" />
      </RadioGroup>
    </FormControl>
  );
}
BookAvailableRaioButtons.propTypes = {
  value: PropTypes.bool,
  setValue: PropTypes.func
}