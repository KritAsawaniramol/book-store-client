import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { sendUserProtectedReq } from './api/useApi';
import CircularProgress from '@mui/material/CircularProgress';
import { THB } from './textFormat';
import { Box, Button, FormControl, FormLabel, MenuItem, Select, TextField } from '@mui/material';
import DatePicker from './DatePicker';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

const columns = [
    {
        id: 'created_at',
        label: 'Created At',
        minWidth: 200,
        align: 'center',
        format: (value) => new Date(value).toLocaleString(),
    },
    {
        id: 'transactions_id',
        label: 'ID',
        align: 'center',
        minWidth: 100,
    },
    {
        id: 'users_id',
        label: 'User ID',
        minWidth: 100,
        align: 'center',

    },
    {
        id: 'username',
        label: 'Username',
        minWidth: 200,
        align: 'center',

    },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 200,
        align: 'center',
        format: (value) => `$${value.toLocaleString()}`,
    },
    {
        id: 'updated_at',
        label: 'Updated At',
        minWidth: 200,
        align: 'center',
        format: (value) => new Date(value).toLocaleString(),
    },
    {
        id: 'note',
        label: 'Note',
        minWidth: 200,
        align: 'center',
    },
];


function Row(props) {
    const { row } = props;

    const getAmountColor = (amount) => {
        if (amount > 0) {
            return 'green'
        } else if (amount < 0) {
            return 'red'
        }
        return 'black'
    }
    return (
        <TableRow hover >
            <TableCell align="center">{row.createdAt}</TableCell>
            <TableCell align="center" >{row.id} </TableCell>
            <TableCell align="center">{row.userID}</TableCell>
            <TableCell align="center">{row.username}</TableCell>
            <TableCell sx={{ color: getAmountColor(row.amount) }} align="right">{THB.format(row.amount)}</TableCell>
            <TableCell align="center">{row.updatedAt}</TableCell>
            <TableCell align="center">{row.note || ""}</TableCell>
        </TableRow>

    );
}

export default function UserTransactionsTable(props) {
    const {updateTable, setUpdateTable} = props
    const [rows, setRows] = React.useState([])
    const [displayRows, setDisplayRows] = React.useState([])
    const [rowsByNote, setRowsByNote] = React.useState()
    const [notes, setNotes] = React.useState([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = React.useState(true)
    const [noteFilter, setNoteFilter] = React.useState("all")
    const [startDate, setStartDate] = React.useState()
    const [idFilter, setIDFilter] = React.useState("")
    const [userIDFilter, setUserIDFilter] = React.useState("")
    const [usernameFilter, setUsernameFilter] = React.useState("")
    const [endDate, setEndDate] = React.useState()

    const fetchData = () => {
        setIsLoading(true)
        sendUserProtectedReq.get("/user/transaction")
            .then((res) => {
                let newRows = []
                const transactions = res.data.transactions
                if (transactions.length > 0) {
                    for (let i = 0; i < transactions.length; i++) {
                        newRows.push(createData(
                            transactions[i].created_at,
                            transactions[i].transaction_id,
                            transactions[i].user_id,
                            transactions[i].username,
                            transactions[i].amount,
                            transactions[i].updated_at,
                            transactions[i].note,
                        ))
                    }
                    newRows.sort((x, y) => {
                        const dateX = new Date(x.createdAt)
                        const dateY = new Date(y.createdAt)
                        if (dateX < dateY) return 1;
                        if (dateX > dateY) return -1;
                        return 0;
                    })
                    const noteGroups = Object.groupBy(newRows, ({ note }) => note);
                    setRowsByNote(noteGroups)

                    setNotes(Object.keys(noteGroups))
                    setRows(newRows)
                    setDisplayRows(newRows)

                }
            })
            .catch((err) => alert(err))
            .finally(() => {
                setIsLoading(false)
            })
    }
    function createData(createdAt, id, userID, username, amount, updatedAt, note) {
        const c = new Date(createdAt);
        const u = new Date(updatedAt);
        const cStr = c.toLocaleString()
        const uStr = u.toLocaleString()
        return {
            createdAt: cStr, id, userID, username, amount, updatedAt: uStr, note
        };
    }

    React.useEffect(() => {
        fetchData()
        setUpdateTable(false)
    }, [updateTable])


    React.useEffect(() => {
        fetchData()
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleNoteFilterChange = (e) => {
        setNoteFilter(e.target.value)
    }


    const handleApplyFilter = () => {
        let newRows = rows
        if (noteFilter != "all") {
            newRows = rowsByNote[noteFilter]
        }

        if (idFilter && idFilter !== "") {
            newRows = newRows.filter((r) => r.id === parseInt(idFilter)
            )
        }
        if (usernameFilter && usernameFilter !== "") {
            newRows = newRows.filter((r) => r.username.startsWith(usernameFilter))

        }
        if (userIDFilter && userIDFilter !== "") {
            newRows = newRows.filter((r) => r.userID === parseInt(userIDFilter)
            )
        }
        console.log(typeof startDate );
        console.log(typeof endDate );
        if (startDate) {
            dayjs.extend(isSameOrAfter)
            newRows = newRows.filter((r) =>
                dayjs(r.createdAt).isSameOrAfter(dayjs(startDate)))
        }
        if (endDate) {
            newRows = newRows.filter((r) =>{
                const end = new Date(endDate)
                end.setHours(23,59,59,999)
                const createdAt = new Date(r.createdAt)
                return createdAt <= end
            }
        )
        }
        setDisplayRows(newRows)
    }

    return (
        <>
            {
                isLoading ? <CircularProgress /> :
                    <Box  >
                        <Box
                            mb={'20px'}
                            display={'flex'}
                            flexWrap={'wrap'}
                            gap={'20px'}
                            alignItems={'center'} >
                            <FormControl sx={{ width: '200px' }}>
                                <FormLabel>ID</FormLabel>
                                <TextField 
                                type='number' 
                                placeholder='ID' 
                                value={idFilter} 
                                onChange={(e) => setIDFilter(e.target.value)}></TextField>
                            </FormControl>
                            <FormControl sx={{ width: '200px' }}>
                                <FormLabel>User ID</FormLabel>
                                <TextField type='number' placeholder='User ID' value={userIDFilter} onChange={(e) => setUserIDFilter(e.target.value)}></TextField>
                            </FormControl>
                            <FormControl sx={{ width: '200px' }}>
                                <FormLabel>Username</FormLabel>
                                <TextField placeholder='Username' value={usernameFilter} onChange={(e) => setUsernameFilter(e.target.value)}></TextField>
                            </FormControl>

                            <FormControl sx={{ width: '200px' }}>
                                <FormLabel>Note</FormLabel>
                                <Select
                                    value={noteFilter}
                                    onChange={handleNoteFilterChange}
                                >
                                    <MenuItem sx={{ minHeight: '30px !important' }} value={'all'}>All</MenuItem>
                                    {
                                        notes.map((n, idx) =>
                                            <MenuItem key={idx} sx={{ minHeight: '30px !important' }} value={n}>{n}</MenuItem>
                                        )
                                    }

                                </Select>
                            </FormControl>
                            <Box display={'flex'} gap={'20px'} flexWrap={'wrap'}>
                                <DatePicker label={"Start"} date={startDate} setDate={setStartDate} />
                                <DatePicker label={"End"} date={endDate} setDate={setEndDate} />
                            </Box>
                            <Button variant='contained' onClick={handleApplyFilter}>Apply</Button>
                        </Box>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440, }}>
                                <Table stickyHeader >
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((columns, idx) => {
                                                return (
                                                    <TableCell
                                                        key={idx}
                                                        align={columns.align}
                                                        style={{ minWidth: columns.minWidth }}
                                                    >
                                                        {columns.label}
                                                    </TableCell>
                                                )
                                            }
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {displayRows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, idx) => {
                                                return (
                                                    <Row key={idx} row={row} />
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={displayRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>

            }
        </>
    );
}
Row.propTypes = {
    row: PropTypes.shape({
        createdAt: PropTypes.string,
        id: PropTypes.number,
        userID: PropTypes.number,
        username: PropTypes.string,
        amount: PropTypes.number,
        updatedAt: PropTypes.string,
        note: PropTypes.string,
    }),
};
UserTransactionsTable.propTypes = {
    updateTable: PropTypes.bool,
    setUpdateTable: PropTypes.func
};