import { Box, Button, CircularProgress, CssBaseline, FormControl, FormLabel, Grid2, Pagination, TextField, ThemeProvider, Typography } from "@mui/material";
import { AdminDrawer } from "./AdminDrawer";
import { useThemeContext } from "./theme/ThemeContextProvider";
import AutocompleteSelectTags from "./AutocompleteSelectTags";
import { sendBookProtectedReq } from "./api/useApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminBookCard from "./AdminBookCard";

export default function AdminBook() {
    const { theme } = useThemeContext();
    const [data, setData] = useState({})
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [tags, setTags] = useState([])
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPriceError, setMaxPriceError] = useState(false);
    const [maxPriceErrorMessage, setMaxPriceErrorMessage] = useState("");
    const [minPriceError, setMinPriceError] = useState(false);
    const [minPriceErrorMessage, setMinPriceErrorMessage] = useState("");
    let [searchParams, setSearchParams] = useSearchParams();

    const handleChangePage = (e, value) => {
        e.preventDefault(); // Prevent page refresh
        searchParams.set("page", value)
        setSearchParams(searchParams)
        setPage(value)
        fetchBooks(searchParams.toString()); // Trigger search after submitting
    };
    const fetchBooks = (query) => {
        setIsLoading(true)
        let path = `/admin/book?limit=10`
        if (query !== "") {
            path = path.concat(`&${query}`)
        } else {
            path = path.concat(`&page=1`)
        }
        sendBookProtectedReq.get(path).
            then((res) => {
                console.log(res.data);
                setData(res.data)
            }).catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const handleApplyFilter = (e) => {
        e.preventDefault()
        if (maxPriceError || minPriceError) {
            return
        }

        // searchParams = {}
        searchParams.set("page", 1)

        const tagFilter = tags.map((t) => t.id).join(',')
        if (tagFilter !== "") {
            // q = q.concat(`&tag_ids=${tagFilter}`)
            searchParams.set("tag_ids", tagFilter)
        } else {
            searchParams.delete("tag_ids")
        }
        if (title !== "") {
            // q = q.concat(`&title=${title}`)
            searchParams.set("title", title)
        } else {
            searchParams.delete("title")
        }
        if (author !== "") {
            // q = q.concat(`&author_name=${author}`)
            searchParams.set("author_name", author)
        } else {
            searchParams.delete("author_name")
        }
        if (minPrice !== "") {
            // q = q.concat(`&min_price=${minPrice}`)
            searchParams.set("min_price", minPrice)
        } else {
            searchParams.delete("min_price")

        }
        if (maxPrice !== "") {
            // q = q.concat(`&max_price=${maxPrice}`)
            searchParams.set("max_price", maxPrice)
        } else {
            searchParams.delete("max_price")
        }
        setSearchParams(searchParams)
        fetchBooks(searchParams.toString())
    }
    const validateForm = () => {
        let isValid = true
        if (maxPrice !== "" && (!maxPrice || parseInt(maxPrice) < 0)) {
            setMaxPriceError(true)
            setMaxPriceErrorMessage('Enter max price (equal or greater than 0).');
            isValid = false
        } else {
            setMaxPriceError(false)
            setMaxPriceErrorMessage("")
        }
        if (minPrice !== "" && (!minPrice || parseInt(minPrice) < 0)) {
            setMinPriceError(true)
            setMinPriceErrorMessage('Enter min price (equal or greater than 0).');
            isValid = false
        } else {
            setMinPriceError(false)
            setMinPriceErrorMessage("")
        }

        return isValid
    }

    useEffect(() => {
        console.log("useEffect");
        console.log(searchParams.toString());
        if (searchParams.get("page")) {
            setPage(parseInt(searchParams.get("page")))
        }
        fetchBooks(searchParams.toString())
    }, [])
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminDrawer>
                {
                    isLoading ? <CircularProgress /> :
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                            <Typography 
                            alignSelf={'flex-start'} 
                            variant="h3" 
                            fontWeight={'bold'} 
                            mb={'30px'}>Search result: {data.pagination ? data.pagination.total : 0}</Typography>
                            <Box component={'form'} onSubmit={handleApplyFilter} display={'flex'} gap={'20px'} flexWrap={'wrap'} mb={'30px'}>
                                <FormControl >
                                    <FormLabel>Title</FormLabel>
                                    <TextField
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl >
                                    <FormLabel>Author name</FormLabel>
                                    <TextField
                                        placeholder="Author name"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    ></TextField>
                                </FormControl>
                                <FormControl >
                                    <FormLabel>Max price</FormLabel>
                                    <TextField
                                        type="number"
                                        placeholder="Max price"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        error={maxPriceError}
                                        helperText={maxPriceErrorMessage}
                                    ></TextField>
                                </FormControl>
                                <FormControl >
                                    <FormLabel>Min price</FormLabel>
                                    <TextField
                                        type="number"
                                        placeholder="Min price"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        error={minPriceError}
                                        helperText={minPriceErrorMessage}
                                    ></TextField>
                                </FormControl>
                                <FormControl >
                                    <FormLabel>Tags</FormLabel>
                                    <AutocompleteSelectTags selected={tags} setSelected={setTags} />
                                </FormControl>
                                <Button
                                    type="submit"
                                    variant='contained'
                                    sx={{ height: '40px', alignSelf: 'flex-end' }}
                                    onClick={validateForm}>
                                    Apply
                                </Button>
                            </Box>
                            <Grid2 container spacing={2} width={'100%'}>
                                {
                                    data.books?.map((b, i) =>
                                        <Grid2
                                            key={i}
                                            size={{ xxs: 6, xs: 6, sm: 4, smmd: 3, md: 2.4, lg: 2.4 }}
                                            justifyContent={'center'}
                                            display={'flex'}
                                        >
                                            <AdminBookCard
                                                id={b.id}
                                                name={b.title}
                                                author={b.author_name}
                                                price={b.price}
                                                bookCoverImageUrl={b.cover_image_url}
                                                isAvailable={b.is_available}
                                            />
                                        </Grid2>
                                    )
                                }
                            </Grid2>
                            <Pagination
                                page={page}
                                sx={{ my: '20px' }}
                                onChange={handleChangePage}
                                count={data.pagination ? data.pagination.last_visible_page : 0}
                                showFirstButton showLastButton
                                size="large" />
                        </Box>
                }
            </AdminDrawer>
        </ThemeProvider>
    )
}