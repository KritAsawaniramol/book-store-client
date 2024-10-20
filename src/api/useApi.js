import axios from "axios";
import {
  getAccessToken,
  getCredentialID,
  getRefreshToken,
  removeAccessToken,
  removeCredentialID,
  removeIsUserLoggedIn,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../auth/authClientStore";

export const sendUserPublicReq = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVER_API_URL,
  timeout: 10000,
});

export const sendBookPublicReq = axios.create({
  baseURL: import.meta.env.VITE_BOOK_SERVER_API_URL,
  timeout: 10000,
});

export const sendBookProtectedReq = axios.create({
  baseURL: import.meta.env.VITE_BOOK_SERVER_API_URL,
  timeout: 10000,
});

export const sendAuthPublicReq = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVER_API_URL,
  timeout: 10000,
});

export const sendUserProtectedReq = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVER_API_URL,
  timeout: 10000,
});

export const sendOrderProtectedReq = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVER_API_URL,
  timeout: 10000,
});

export const sendOrderPublicReq = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVER_API_URL,
  timeout: 10000,
});


export const sendShelfProtectedReq = axios.create({
  baseURL: import.meta.env.VITE_SHELF_SERVER_API_URL,
  timeout: 10000,
});

const getProtectedReqConfig = (config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
};

const errorResponseInterceptor = async (err) => {
  console.log(err);
  const originalRequest = err.config;
  if (err.response.status === 401 && !originalRequest._isRetry) {
    originalRequest._isRetry = true;
    return refreshToken()
      .then((newAccessToken) => {
        console.log("newAccessToken: ", newAccessToken);
        sendUserProtectedReq.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return sendUserProtectedReq(originalRequest);
      })
      .catch((err) => {
        removeAccessToken();
        removeRefreshToken();
        removeCredentialID();
        removeIsUserLoggedIn();
        alert("Your token has expired. Please login again");
        window.location.href = "/";
        return Promise.reject(err);
      });
  }
  return Promise.reject(err);
};

sendUserProtectedReq.interceptors.request.use(
  (config) => getProtectedReqConfig(config),
  (err) => Promise.reject(err)
);

sendUserProtectedReq.interceptors.response.use(
  (res) => res,
  async (err) => errorResponseInterceptor(err)
);

sendOrderProtectedReq.interceptors.request.use(
  (config) => getProtectedReqConfig(config),
  (err) => Promise.reject(err)
);

sendOrderProtectedReq.interceptors.response.use(
  (res) => res,
  async (err) => errorResponseInterceptor(err)
);


sendShelfProtectedReq.interceptors.request.use(
  (config) => getProtectedReqConfig(config),
  (err) => Promise.reject(err)
);

sendShelfProtectedReq.interceptors.response.use(
  (res) => res,
  async (err) => errorResponseInterceptor(err)
);


sendBookProtectedReq.interceptors.request.use(
  (config) => getProtectedReqConfig(config),
  (err) => Promise.reject(err)
);

sendBookProtectedReq.interceptors.response.use(
  (res) => res,
  async (err) => errorResponseInterceptor(err)
);

export const refreshToken = async () => {
  return sendAuthPublicReq
    .post("/auth/refresh-token", {
      credential_id: parseInt(getCredentialID()),
      refresh_token: getRefreshToken(),
    })
    .then((res) => {
      setAccessToken(res.data.access_token);
      setRefreshToken(res.data.refresh_token);
      return res.data.access_token;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
