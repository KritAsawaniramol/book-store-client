import { createContext, useContext, useState } from "react"
import PropTypes from 'prop-types';
import { getAccessToken, getIsUserLoggedIn, removeAccessToken, removeCredentialID, removeIsUserLoggedIn, removeRefreshToken, setAccessToken, setCredentialID, setIsUserLoggedIn, setRefreshToken } from "./authClientStore";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be within AuthContextProvider")
    }
    return ctx
}

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(getIsUserLoggedIn());
    const accesstoken = getAccessToken()

    let roleID = 0
    if (accesstoken) {
        const decoded = jwtDecode(accesstoken);
        roleID = decoded.role_id
    }

    const login = (credential) => {
        setAccessToken(credential.access_token)
        setRefreshToken(credential.refresh_token)
        setCredentialID(credential.id)
        setIsUserLoggedIn(1)
        const decoded = jwtDecode(credential.access_token);
        roleID = decoded.role_id
        setIsAuthenticated(true)
    }


    const logout = () => {
        removeAccessToken()
        removeRefreshToken()
        removeCredentialID()
        removeIsUserLoggedIn()
        setIsAuthenticated(false)
    }
    return (
        <AuthContext.Provider value={{ login, logout, isAuthenticated, roleID }}>
            {children}
        </AuthContext.Provider>
    )
}



AuthContextProvider.propTypes = {
    children: PropTypes.element
}