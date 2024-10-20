import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export function InputImageUpload(props) {
    const { input, setInput } = props
    return (
        <>
          {input && (
                <Box>
                    <Box
                        component={'img'}
                        sx={{ width: '100%',maxHeight: '500px', objectFit: 'contain' }}
                        src={URL.createObjectURL(input)}
                    >
                    </Box>
                </Box>
            )}
            <Box display={'flex'} flexWrap={'wrap'} gap={'10px'} rowGap={'10px'} >
          
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    sx={{ width: 'fit-content' }}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload book cover image
                    <VisuallyHiddenInput
                        type="file"
                        accept='image/png,image/jpg,image/jpeg'
                        onChange={(e) => {
                            setInput(e.target.files[0])
                        }}
                        multiple
                    />
                </Button>
                <Button variant="outlined" color='error'
                    onClick={() => {
                        setInput()
                    }}>Remove file</Button>
            </Box>
            <Typography>{input?.name || "No selected file"}</Typography>
       
        </>
    );
}



export function InputPdfUpload(props) {
    const { input, setInput } = props
    return (
        <>
         {input &&
                <iframe src={URL.createObjectURL(input)} width="100%" height="600" />
            }
            <Box display={'flex'} flexWrap={'wrap'} gap={'10px'} rowGap={'10px'} >
                <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload PDF files
                    <VisuallyHiddenInput
                        type="file"
                        accept='application/pdf'
                        onChange={(e) => {
                            setInput(e.target.files[0])
                        }}
                        multiple
                    />
                </Button>
                <Button variant="outlined" color='error'
                    onClick={() => {
                        setInput()
                    }}>Remove file</Button>
            </Box>
            <Typography>{input?.name || "No selected file"}</Typography>
        </>
    );
}

InputImageUpload.propTypes = {
    input: PropTypes.shape({
        name: PropTypes.string
    }), 
    setInput: PropTypes.func
}
InputPdfUpload.propTypes = {
    input: PropTypes.shape({
        name: PropTypes.string
    }),
    setInput: PropTypes.func
}

