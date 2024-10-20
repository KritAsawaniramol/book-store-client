
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material'
import PropTypes from 'prop-types'

function SaveUpdateBookModal(props) {
    const { open, handleClose, handleOnClickYes, message } = props

    const onClickYes = () => {
        handleClose()
        handleOnClickYes()
    }

    return (
        <div>
            <Modal
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
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        borderRadius: '10px',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6" fontWeight={'bold'} width={'300px'} >
                            {message}
                        </Typography>

                        <Box display={'flex'} gap={"10px"}>
                            <Button variant='contained' color='success' onClick={onClickYes}>Yes</Button>
                            <Button variant='contained' color='error' onClick={handleClose} >Cancel</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

SaveUpdateBookModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleOnClickYes: PropTypes.func,
    message: PropTypes.string
}

export default SaveUpdateBookModal

