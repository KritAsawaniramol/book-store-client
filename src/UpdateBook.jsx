import { Box, Button, CircularProgress, Container, CssBaseline, Divider, FormControl, FormHelperText, FormLabel, LinearProgress, TextField, ThemeProvider } from "@mui/material";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { sendBookProtectedReq } from "./api/useApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminDrawer } from "./AdminDrawer";
import AutocompleteSelectTags from "./AutocompleteSelectTags";
import { InputImageUpload, InputPdfUpload } from "./InputFileUpload";
import SaveUpdateBookModal from "./SaveUpdateBookDetailModal";
import axios from "axios";
import BookAvailableRaioButtons from "./BookAvailableRaioButtons";

export default function UpdateBook() {
    const { theme } = useThemeContext();
    let { bookID } = useParams();
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [titleErrorMessage, setTitleErrorMessage] = useState("");
    const [tags, setTags] = useState([])
    const [isBookLoading, setIsBookLoadding] = useState(true)
    const [isReadBookLoading, setIsReadBookLoadding] = useState(true)
    const [price, setPrice] = useState(0);
    const [priceError, setPriceError] = useState(false);
    const [priceErrorMessage, setPriceErrorMessage] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [pdf, setPdf] = useState();
    const [newPdf, setNewPdf] = useState();
    const [newPdfError, setNewPdfError] = useState(false);
    const [newPdfErrorMessage, setNewPdfErrorMessage] = useState("");
    const [image, setImage] = useState();
    const [newImage, setNewImage] = useState();
    const [openSaveDetailModal, setOpenSaveDetailModal] = useState(false)
    const [openSaveImageModal, setOpenSaveImageModal] = useState(false)
    const [openSavePdfModal, setOpenSavePdfModal] = useState(false)
    const [uploadImageProgressValue, setUploadImageProgressValue] = useState(0);
    const [uploadFileProgressValue, setUploadFileProgressValue] = useState(0);
    const [isAvailable, setIsAvailable] = useState(false);

    const validateForm = () => {
        let isValid = true;
        if (!title || title.length < 1) {
            setTitleError(true)
            setTitleErrorMessage('Enter title.');
            isValid = false
        } else {
            setTitleError(false)
            setTitleErrorMessage("")
        }
        if (parseInt(price) < 0) {
            setPriceError(true)
            setPriceErrorMessage('Enter price (equal or greater than 0).');
            isValid = false
        } else {
            setPriceError(false)
            setPriceErrorMessage("")
        }
        return isValid
    }

    const validatePdf = () => {
        let isValid = true;
        if (!newPdf) {
            setNewPdfError(true)
            setNewPdfErrorMessage('Choose book file (.pdf).');
            isValid = false
        } else {
            setNewPdfError(false)
            setNewPdfErrorMessage("")
        }
        return isValid
    }

    let updateBookCoverController = new AbortController();
    let updateBookFileController = new AbortController();

    const cancelUploadFile = () => {
        if (updateBookFileController) {
            updateBookFileController.abort()
            updateBookFileController = new AbortController(); 
        }
    }

    const handleUpdateBookFile = () => {
        const formData = new FormData()
        
        if (newPdf != null) {
            formData.append('book_file', newPdf)
        } else {
            return
        }
        sendBookProtectedReq.patch(
            `/book/file/${bookID}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: function (progressEvent) {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadFileProgressValue(percentCompleted);
                    }
                },
                signal: updateBookFileController.signal // Pass the signal to cancel the request if needed
            }

        )
            .then((res) => {
                console.log(res.data);
                location.reload()
            })

            .catch((err) => {
                console.log(err.message);
                if (axios.isCancel(err)) {
                    alert('Upload canceled');
                } else {
                    console.error('Error uploading file:', err.message);
                    alert('Error uploading file');
                }
            })
    }

    const handleUpdateBookCover = () => {
        const formData = new FormData()

        if (newImage != null) {
            formData.append('book_cover', newImage)
        } else {
            return
        }
        sendBookProtectedReq.patch(
            `/book/cover/${bookID}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: function (progressEvent) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setUploadImageProgressValue(percentCompleted)
                },
                signal: updateBookCoverController.signal
            },

        )
            .then((res) => {
                console.log(res.data);
                location.reload()
            })

            .catch((err) => {
                console.log(err);
                if (axios.isCancel(err)) {
                    alert('Cancel upload new image')
                } else {
                    alert('Error uploading file')
                }
            })
    }


    const handleSubmitBookDetail = () => {
        if (titleError || priceError) {
            return
        }
        sendBookProtectedReq.patch(`/book/${bookID}`, {
            "title": title,
            "price": Number(price),
            "author_name": author,
            "description": description,
            "tags": tags,
            "is_available": isAvailable
        }).catch((err) => {
            console.log(err.response.data.message);
            alert('Error uploading file')
        })
            .finally(() => location.reload())
    }

    const fetchBookData = () => {
        setIsBookLoadding(true)
        sendBookProtectedReq.get(`/admin/book/${bookID}`)
            .then((res) => {
                const book = res.data
                setTitle(book.title)
                setTags(book.tags)
                setAuthor(book.author_name)
                setPrice(book.price)
                setDescription(book.des)
                setImage(book.cover_image_url)
                setIsAvailable(book.is_available)
            })
            .catch((err) => {alert(err.response.data.message)})
            .finally(() => {
                setIsBookLoadding(false)
            })
    }

    const fetchBook = () => {
        setIsReadBookLoadding(true)
        sendBookProtectedReq.get(`/book/read/${bookID}`, { responseType: 'blob' })
            .then((res) => {
                const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                console.log(res.data.name);
                console.log(res.headers);

                setPdf(pdfBlob);
            })
            .catch((err) => {
                console.error(err.response);
            })
            .finally(() => {
                setIsReadBookLoadding(false)
            })
    }

    useEffect(() => {
        fetchBookData()
        fetchBook()
    }, [])


    const handleOnClickSave = () => {
        if (validateForm()) {
            setOpenSaveDetailModal(true)
        }
    }
    const handleOnClickSavePdf = () => {
        if (validatePdf()) {
            setOpenSaveDetailModal(true)
        }
    }

    const cancelUploadImage = () => {
        if (updateBookCoverController) {
            updateBookCoverController.abort()

        }
    }
   





    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminDrawer>
                <Container maxWidth='lg'>

                    <Container maxWidth='md'>
                        {
                            isBookLoading ? <CircularProgress /> :
                                <Box component={'form'} >
                                    <TextField
                                        multiline
                                        maxRows={4}
                                        value={title}
                                        error={titleError}
                                        helperText={titleErrorMessage}
                                        onChange={(e) => setTitle(e.target.value)}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                style: {
                                                    fontSize: "3.125rem",
                                                    fontWeight: 'bolder'
                                                }
                                            }
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center'
                                            }
                                        }}
                                    />
                                    <Box >
                                        <Box display={'flex'} sx={{
                                            [theme.breakpoints.down('smmd')]: {
                                                flexWrap: 'wrap',
                                                justifyContent: 'center'
                                            }
                                        }}>
                                            <Box display={'flex'} flexDirection={'column'}>
                                                <Box
                                                    component={'img'}
                                                    src={image}
                                                    sx={{ height: 300, objectFit: 'contain', aspectRatio: '2.2/3' }}
                                                ></Box>
                                                <FormControl>
                                                    <FormLabel>Price</FormLabel>
                                                    <TextField
                                                        helperText={priceErrorMessage}
                                                        error={priceError}
                                                        placeholder="Price"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        type="number"
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                textAlign: 'center'
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                        <BookAvailableRaioButtons value={isAvailable} setValue={setIsAvailable}/>
                                            </Box>
                                            <Box
                                                padding={'20px'}
                                                flexGrow={1}
                                                display={'flex'}
                                                gap={"20px"}
                                                flexDirection={'column'}
                                            >
                                                <AutocompleteSelectTags newTagInput={true} selected={tags} setSelected={setTags} />
                                                <FormControl>
                                                    <FormLabel>Author Name</FormLabel>
                                                    <TextField
                                                        value={author}
                                                        multiline
                                                        onChange={(e) => setAuthor(e.target.value)}
                                                        maxRows={4}
                                                    ></TextField>
                                                </FormControl>
                                                <FormControl >
                                                    <FormLabel>Description</FormLabel>
                                                    <TextField
                                                        multiline
                                                        rows={6}
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        placeholder="Description"
                                                    />
                                                </FormControl>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleOnClickSave}>Save</Button>
                                            </Box>
                                        </Box>

                                    </Box>
                                </Box>
                        }
                    </Container>
                    <Divider sx={{ mb: '50px' }} />

                    <Box display={'flex'} flexWrap={'wrap'} rowGap={'20px'} >
                        <FormControl
                            sx={{
                                width: '50%',
                                paddingX: '20px',
                                minWidth: '300px',
                                flexGrow: '1',
                            }}
                        >
                            <FormLabel>Current book cover image</FormLabel>
                            <Box
                                component={'img'}
                                sx={{
                                    width: '100%',
                                    maxHeight: '500px',
                                    objectFit: 'contain'
                                }}
                                src={image || ""}
                            >
                            </Box>
                        </FormControl>
                        <FormControl
                            sx={{
                                paddingX: '20px',
                                width: '50%',
                                flexGrow: '1',
                                minWidth: '300px'
                            }}
                        >
                            <FormLabel>Book cover image</FormLabel>
                            <InputImageUpload setInput={setNewImage} input={newImage} />
                        </FormControl>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        <Button
                            disabled={newImage == null}
                            size="large"
                            variant="contained"
                            onClick={() => handleOnClickSavePdf()}
                        >Save new image</Button>
                        <Button variant="outlined" color="error" onClick={cancelUploadImage}>Cancel</Button>
                    </Box>
                    <LinearProgress sx={{ height: '10px', mt: '20px' }} variant="determinate" color="secondary" value={uploadImageProgressValue} />

                    <Divider sx={{ my: '50px' }} />
                    <Box display={'flex'} flexWrap={'wrap'} rowGap={'20px'} >
                    </Box>
                    {
                        isReadBookLoading ? <CircularProgress /> :
                            <Box display={'flex'} flexWrap={'wrap'}  >
                                <FormControl
                                    sx={{
                                        width: '50%',
                                        paddingX: '20px',
                                        minWidth: '425px',
                                        flexGrow: '1',
                                    }}
                                >
                                    <FormLabel>Current PDF file</FormLabel>
                                    <Box
                                        component={'iframe'}
                                        src={pdf ? URL.createObjectURL(pdf): ""}
                                        height="600px"></Box>
                                </FormControl>
                                <FormControl sx={{
                                    width: '50%',
                                    minWidth: '425px',
                                    paddingX: '20px',
                                    flexGrow: '1',
                                }}  >
                                    <FormLabel>PDF file</FormLabel>
                                    <InputPdfUpload setInput={(files) => {
                                        console.log(files);
                                        setNewPdf(files)
                                    }} input={newPdf} />
                                    <FormHelperText error={newPdfError} >{newPdfErrorMessage}</FormHelperText>
                                </FormControl>
                            </Box>

                    }

                    <Box display={'flex'} justifyContent={'flex-end'}>
                        <Button
                            disabled={newPdf == null}
                            size="large"
                            variant="contained"
                            onClick={() => setOpenSavePdfModal(true)}
                        >Save new file</Button>
                        <Button variant="outlined" color="error" onClick={cancelUploadFile}>Cancel</Button>
                    </Box>
                    <LinearProgress
                        sx={{ height: '10px', mt: '20px' }}
                        variant="determinate"
                        color="secondary"
                        value={uploadFileProgressValue}
                    />
                    <SaveUpdateBookModal
                        message={"Do you want to save book detail changes?"}
                        open={openSaveDetailModal}
                        handleOnClickYes={handleSubmitBookDetail}
                        handleClose={() => setOpenSaveDetailModal(false)}
                    />
                    <SaveUpdateBookModal
                        message={"Do you want to use new image to be book cover?"}
                        open={openSaveImageModal}
                        handleOnClickYes={handleUpdateBookCover}
                        handleClose={() => setOpenSaveImageModal(false)}
                    />
                    <SaveUpdateBookModal
                        message={"Do you want to use new pdf file to be book file?"}
                        open={openSavePdfModal}
                        handleOnClickYes={handleUpdateBookFile}
                        handleClose={() => setOpenSavePdfModal(false)}
                    />
                </Container>
            </AdminDrawer>
        </ThemeProvider>
    )
}
