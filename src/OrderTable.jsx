import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Chip, Collapse, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { sendOrderProtectedReq } from './api/useApi';
import CircularProgress from '@mui/material/CircularProgress';
import { THB } from './textFormat';
const columns = [
    {

    },
    {
        id: 'created_at',
        label: 'Created At',
        minWidth: 170,
        align: 'center',
        format: (value) => new Date(value).toLocaleString(),
    },
    {
        id: 'order_id',
        label: 'ID',
        align: 'center',
        minWidth: 100,
    },
    {
        id: 'quantity',
        label: 'Quantity',
        minWidth: 100,
        align: 'center',
        format: (value) => `$${value.toLocaleString()}`,
    },
    {
        id: 'total_price',
        label: 'Total Price',
        minWidth: 100,
        align: 'center',
        format: (value) => `$${value.toLocaleString()}`,
    },
    {
        id: 'status',
        label: 'Status',
        align: 'center',
        minWidth: 100,
    },


    {
        id: 'updated_at',
        label: 'Updated At',
        minWidth: 170,
        align: 'center',
        format: (value) => new Date(value).toLocaleString(),
    },
];
function createData(id, total, status, createAt, updateAt, books) {
    const quantity = books ? books.length : 0
    const c = new Date(createAt);
    const u = new Date(updateAt);
    const cStr = c.toLocaleString()
    const uStr = u.toLocaleString()
    return {
        id, quantity, total, status, createAt: cStr, updateAt: uStr, books
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const mapStatusColor = new Map()
    mapStatusColor.set("completed", "success")
    mapStatusColor.set("pendding", "info")
    mapStatusColor.set("failed", "error")
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">{row.createAt}</TableCell>
                <TableCell align="center" component="th" scope="row">
                    {row.id}
                </TableCell>
                <TableCell align="right">{row.quantity.toLocaleString()}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
                <TableCell align="center">
                    <Chip label={row.status} color={mapStatusColor.get(row.status)} />
                </TableCell>
                <TableCell align="center">{row.updateAt}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h5" gutterBottom component="div" fontWeight={'bold'}>
                                Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell ><Typography fontWeight={'bold'} variant='h6'>Title</Typography></TableCell>
                                        <TableCell align="right"><Typography fontWeight={'bold'} variant='h6'>Quantity</Typography></TableCell>
                                        <TableCell align="right"><Typography fontWeight={'bold'} variant='h6'>Price</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.books.map((book, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell component="th" scope="row">
                                                {book.title}
                                            </TableCell>
                                            <TableCell align="right">{1}</TableCell>
                                            <TableCell align="right">
                                                {THB.format(book.price)}

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function OrderTable() {
    const [rows, setRows] = React.useState([])
    const fetchData = () => {
        setIsLoading(true)
        sendOrderProtectedReq.get("/order")
            .then((res) => {
                let newRows = []
                const orders = res.data.orders
                if (orders.length > 0) {
                    for (let i = 0; i < orders.length; i++) {
                        newRows.push(createData(
                            orders[i].order_id, 
                            orders[i].total_price, 
                            orders[i].status, 
                            orders[i].created_at, 
                            orders[i].updated_at, 
                            orders[i].books
                        ))
                    }
                }
                newRows.sort((x, y) => {
                    const dateX = new Date(x.createAt)
                    const dateY = new Date(y.createAt)
                    if (dateX < dateY) return 1;
                    if (dateX > dateY) return -1;
                    return 0;
                })

                setRows(newRows)
            })
            .catch((err) => alert(err))
            .finally(() => {
                setIsLoading(false)
            })
    }

    React.useEffect(() => {
        fetchData()
    }, [])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = React.useState(true)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            {
                isLoading ? <CircularProgress /> :
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
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
                                    {rows
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
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
            }
        </>
    );
}
Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number,
        quantity: PropTypes.number,
        total: PropTypes.number,
        status: PropTypes.string,
        createAt: PropTypes.string,
        updateAt: PropTypes.string,
        books: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                price: PropTypes.number
            })
        ),
    }),
};