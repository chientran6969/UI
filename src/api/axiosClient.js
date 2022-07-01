// api/axiosClient.js
import axios from "axios";
import queryString from "query-string";
// Set up default config for http requests here

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  var token = JSON.parse(localStorage.getItem("user"))?.token || null;
  config.headers = {
    Authorization: `Bearer ${token}`,
  };
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    var dataError = error?.response?.data;
    return dataError ? dataError : error;
  }
);
export default axiosClient;
