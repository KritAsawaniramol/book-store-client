import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { sendBookPublicReq } from './api/useApi';


export default function AutocompleteSelectTags(props) {
    const { setSelected, selected, newTagInput } = props
    const [newTag, setNewTag] = useState("")
    const [tagsOption, setTagsOption] = useState([])
    const [isTagOptionLoading, setIsTagOptionLoadding] = useState(true)

    const fetchTags = () => {
        setIsTagOptionLoadding(true)
        sendBookPublicReq.get("/book/tags")
            .then((res) => {
                setTagsOption(res.data)
            })
            .catch((err) => console.log(err.response))
            .finally(() => {
                setIsTagOptionLoadding(false)
            })
    }

    useEffect(() => {
        fetchTags()
    }, [])

    const handleChange = (event, value) => {
        setSelected(value)
    };

    const getChipColor = (id) => {
        if (id === 0) {
            return 'primary'
        }
        return ''
    }

    const addNewTag = () => {
        const found = tagsOption.find((t) => t.name === newTag)
        if (found) {
            setSelected([
                ...selected,
                found
            ])
        } else {
            setSelected([
                ...selected,
                { id: 0, name: newTag }
            ]);
        }
        setNewTag("")
    }

    return (
        <>
            {
                isTagOptionLoading ? <Typography>Loading...</Typography> :
                    <Box
                        display={'flex'}
                        gap={"20px"}
                        flexDirection={'column'}
                    >
                        <Autocomplete
                            multiple
                            limitTags={4}
                            options={tagsOption}
                            value={selected}
                            onChange={handleChange}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.name === value.name}  // Specify how to compare
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Select Tags" />
                            )}
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip
                                        {...getTagProps({ index })}
                                        key={index}
                                        label={option.name}
                                        color={getChipColor(option.id)}

                                    />
                                ))
                            }
                            sx={{
                                flexGrow: 1, minWidth: '270px',
                                '& .MuiAutocomplete-input': {
                                    minWidth: '150px !important'
                                }
                            }}
                        />
                        {
                            newTagInput &&
                            <Box display={'flex'} flexWrap={'wrap'} gap={'20px'} >
                                <TextField
                                    variant="outlined"
                                    placeholder="New tag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)} />
                                <Button
                                    variant="contained"
                                    onClick={addNewTag}>
                                    Add new tag</Button>
                            </Box>
                        }
                    </Box>
            }

        </>
    );
}

AutocompleteSelectTags.propTypes = {
    setSelected: PropTypes.func,
    selected: PropTypes.array,
    newTagInput: PropTypes.bool,
}

