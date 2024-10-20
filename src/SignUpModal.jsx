import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { sendUserPublicReq } from './api/useApi';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
};

export default function SignUpModal(props) {
    const { open, handleClose } = props
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState(false)
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("")
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('')
    const validateInputs = () => {
        let isValid = true;
        console.log("validateInputs");

        if (!username || username.length < 1) {
            setUsernameError(true)
            setUsernameErrorMessage('Username is required.');
            isValid = false
        } else {
            setUsernameError(false)
            setUsernameErrorMessage("")
        }
        if (!password || password.length < 6) {
            setPasswordError(true)
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!confirmPassword || confirmPassword.length < 1) {
            setConfirmPasswordError(true)
            setConfirmPasswordErrorMessage('Comfirm password is required.')
            isValid = false
        } else if (confirmPassword !== password) {
            setConfirmPasswordError(true)
            setConfirmPasswordErrorMessage('Password do not match.')
            isValid = false
        } else {
            setConfirmPasswordError(false)
            setConfirmPasswordErrorMessage('')
        }
        return isValid
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (usernameError || passwordError || confirmPasswordError) {
            return
        }
        sendUserPublicReq.post('/user/register', {
            username: username,
            password: password
        }).then(function () {
            alert("Register success");
            setUsername("")
            setPassword("")
            setConfirmPassword("")
            handleClose()
        }).catch(function (err) {
            alert(err.response.data.message)
        })
    };
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}

            >
                <Fade in={open}>
                    <Box sx={style} component="form" onSubmit={handleSubmit} >
                        <Box>
                            <Typography variant="h4" fontWeight='bold' >
                                Sign Up
                            </Typography>
                            <Box my={'20px'}>
                                <FormControl fullWidth sx={{ mb: '15px' }} >
                                    <FormLabel>Username</FormLabel>
                                    <TextField
                                        required
                                        variant="outlined"
                                        placeholder='username'
                                        autoComplete='username'
                                        value={username}
                                        error={usernameError}
                                        helperText={usernameErrorMessage}
                                        onChange={(e) => setUsername(e.target.value)}
                                    ></TextField>
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: '15px' }} >
                                    <FormLabel>Password</FormLabel>
                                    <TextField
                                        required
                                        variant="outlined"
                                        placeholder="••••••"
                                        type='password'
                                        autoComplete='new-password'
                                        error={passwordError}
                                        helperText={passwordErrorMessage}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    ></TextField>
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: '15px' }} >
                                    <FormLabel>Confirm Password</FormLabel>
                                    <TextField
                                        required
                                        variant="outlined"
                                        placeholder="••••••"
                                        type='password'
                                        autoComplete='new-password'
                                        value={confirmPassword}
                                        error={confirmPasswordError}
                                        helperText={confirmPasswordErrorMessage}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    ></TextField>
                                </FormControl>
                            </Box>
                            <Button
                                variant='contained'
                                type='submit'
                                fullWidth
                                onClick={validateInputs}
                            >Sign Up</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

SignUpModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func
}

