export const getAccessToken = () => localStorage.getItem("access_token")
export const getRefreshToken = () => localStorage.getItem("refresh_token")
export const getCredentialID = () => localStorage.getItem("credential_id")
export const getIsUserLoggedIn = () => {    
    if (localStorage.getItem("is_user_logged_in")) {
        return true
    } else {
        return false
    }
}

export const setAccessToken = (accessToken) => {localStorage.setItem("access_token", accessToken)}
export const setRefreshToken = (refreshToken) => {localStorage.setItem("refresh_token", refreshToken)}
export const setCredentialID = (credentialID) => {localStorage.setItem("credential_id", credentialID)}
export const setIsUserLoggedIn = (isUserLoggedIn) => {localStorage.setItem("is_user_logged_in", isUserLoggedIn)}

export const removeAccessToken   = () => {localStorage.removeItem("access_token")}
export const removeRefreshToken  = () => {localStorage.removeItem("refresh_token")}
export const removeCredentialID  = () => {localStorage.removeItem("credential_id")}
export const removeIsUserLoggedIn = () => {localStorage.removeItem("is_user_logged_in")}

