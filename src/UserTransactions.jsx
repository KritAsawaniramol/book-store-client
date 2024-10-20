import { Box, Button, CssBaseline, FormControl, FormLabel, TextField, ThemeProvider, Typography } from "@mui/material";
import { AdminDrawer } from "./AdminDrawer";
import { useThemeContext } from "./theme/ThemeContextProvider";
import UserTransactionsTable from "./UserTransactionsTable";
import { useState } from "react";
import { sendUserProtectedReq } from "./api/useApi";

export default function UserTransactions() {
    const { theme } = useThemeContext();
    const [userID, setUserID] = useState()
    const [userIDError, setUserIDError] = useState(false)
    const [userIDErrorMessage, setUserIDErrorMessage] = useState("")
    const [amount, setAmount] = useState()
    const [amountError, setAmountIDError] = useState(false)
    const [amountErrorMessage, setAmountIDErrorMessage] = useState("")
    const validateInputs = () => {
        let isValid = true;
        if (!userID || userID < 1) {
            setUserIDError(true)
            setUserIDErrorMessage('Enter user ID (number that more than 0).');
            isValid = false
        } else {
            setUserIDError(false)
            setUserIDErrorMessage("")
        }
        if (!amount) {
            setAmountIDError(true)
            setAmountIDErrorMessage('Enter amount (Integer).');
            isValid = false
        } else {
            setAmountIDError(false)
            setAmountIDErrorMessage("")
        }

        return isValid
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userIDError || amountError) {
            return
        }
        sendUserProtectedReq.post("/user/transaction", { user_id: Number(userID), amount: Number(amount) })
            .then(() => {
                setUserID()
                setAmount()
            })
            .catch((err) => alert(err.response.data.message))
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminDrawer>
                <Typography variant="h4" fontWeight={'bold'} sx={{mb: '20px'}} >User transactions</Typography>
                <UserTransactionsTable />
                <Typography variant="h5" fontWeight={'bold'} sx={{ mt: '40px' }}>Insert user transaction</Typography>
                <Box component={'form'} autoComplete="off" onSubmit={handleSubmit} display={'flex'} flexDirection={'column'} gap={"20px"} mt={'20px'}>
                    <FormControl >
                        <FormLabel>User ID</FormLabel>
                        <TextField
                            type="number"
                            value={userID}
                            helperText={userIDErrorMessage}
                            error={userIDError}
                            onChange={(e) => {
                                if (/^(|[1-9][0-9]*)$/.test(e.target.value)) {
                                    setUserID(e.target.value)
                                }
                            }}
                        ></TextField>

                    </FormControl>
                    <FormControl >
                        <FormLabel>Amount</FormLabel>
                        <TextField
                            type="number"
                            value={amount}
                            helperText={amountErrorMessage}
                            error={amountError}
                            onChange={(e) => {
                                if (/^-?[0-9]*$/.test(e.target.value)) {
                                    setAmount(e.target.value)
                                }
                            }}
                        ></TextField>
                    </FormControl>
                    <Button variant="contained" type="submit" onClick={validateInputs}>Insert</Button>
                </Box>
            </AdminDrawer>
        </ThemeProvider>
    )
}
