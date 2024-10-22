import { AdminDrawer } from "./AdminDrawer";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { Box, Button,  CssBaseline, FormControl, FormHelperText, FormLabel, InputAdornment, LinearProgress, OutlinedInput, TextField, ThemeProvider, Typography } from "@mui/material";
import {  useEffect, useState } from "react";
import { sendBookProtectedReq } from "./api/useApi";
import { InputPdfUpload, InputImageUpload } from "./InputFileUpload";
import AutocompleteSelectTags from "./AutocompleteSelectTags";

export default function CreateBook() {
    const { theme } = useThemeContext();
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [titleErrorMessage, setTitleErrorMessage] = useState("");
    const [price, setPrice] = useState(0);
    const [priceError, setPriceError] = useState(false);
    const [priceErrorMessage, setPriceErrorMessage] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([])
    const [image, setImage] = useState();
    const [pdf, setPdf] = useState();
    const [pdfError, setPdfError] = useState(false);
    const [pdfErrorMessage, setPdfErrorMessage] = useState("");
    const [progressValue, setProgressValue] = useState(0);
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
            console.log('price error');
            console.log(price);
            console.log(parseInt(price));
            setPriceError(true)
            setPriceErrorMessage('Enter price (equal or greater than 0).');
            isValid = false
        } else {
            setPriceError(false)
            setPriceErrorMessage("")
        }
        if (!pdf) {
            setPdfError(true)
            setPdfErrorMessage('Choose book file (.pdf).');
            isValid = false
        } else {
            setPdfError(false)
            setPdfErrorMessage("")
        }
        return isValid
    }

    useEffect(() => {
        console.log(tags);
    },[tags])


    const handleSubmit = (e) => {
        e.preventDefault();
        if (titleError || priceError || pdfError) {
            return
        }

        const formData = new FormData()
        if (pdf) {
            formData.append('book_file', pdf)
        }
        if (image) {
            formData.append('book_cover', image)
        }
        const json = {
            "title": title,
            "price": Number(price),
            "description": description,
            "author_name": author,
            "tags": tags
        }
        formData.append('json', JSON.stringify(json))
        sendBookProtectedReq.post("/book", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: function (progressEvent) {
                // เพิ่ม update progress กลับเข้า UI ไป
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgressValue(percentCompleted)
                // uploadPercentageDisplay.innerText = `${percentCompleted}%`
            }
        })
            .then((res) => {
                alert(`Create Book success (book_id:${res.data.book_id}).`)
                setAuthor("")
                setImage()
                setTitle("")
                setTags([])
                setPdf()
                setPrice(0)
                setProgressValue(0)
            })
            .catch((error) => {
                console.log('error', error)
                alert('Error uploading file')
            })
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminDrawer>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'10px'}
                    component={'form'}
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h4" fontWeight={'bold'}>Create Book</Typography>
                    <FormControl fullWidth required>
                        <FormLabel>Title</FormLabel>
                        <TextField
                            variant="outlined"
                            required
                            placeholder='title'
                            value={title}
                            error={titleError}
                            helperText={titleErrorMessage}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <FormLabel>Author</FormLabel>
                        <TextField
                            variant="outlined"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Robert Baratheon"
                        />
                    </FormControl>
                    <FormControl fullWidth required>
                        <FormLabel>Price</FormLabel>

                        <OutlinedInput

                            startAdornment={
                                <InputAdornment position="start">฿</InputAdornment>
                            }
                            type="number"
                            value={price}
                            error={priceError}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <FormHelperText error={priceError}>{priceErrorMessage}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <FormLabel>Description</FormLabel>
                        <TextField
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <FormLabel>Tags</FormLabel>
                            <AutocompleteSelectTags selected={tags} setSelected={setTags} newTagInput={true}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <FormLabel>Book cover image</FormLabel>
                        <InputImageUpload setInput={setImage} input={image} />
                    </FormControl>
                    <FormControl fullWidth required >
                        <FormLabel>PDF file</FormLabel>
                        <InputPdfUpload setInput={setPdf} input={pdf} />
                        <FormHelperText error={pdfError} >{pdfErrorMessage}</FormHelperText>
                    </FormControl>
                    <Box mt={'30px'}>
                        <LinearProgress sx={{ height: '10px' }} variant="determinate" color="secondary" value={progressValue} />
                        <Button
                            sx={{ mt: '10px', width: '20%' }}
                            onClick={validateForm}
                            variant="contained"
                            type='submit'
                        >
                            Create</Button>
                    </Box>
                </Box>

            </AdminDrawer>
        </ThemeProvider>

    )
}
