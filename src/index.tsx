import axios, { AxiosRequestConfig } from "axios";
import ReactDOM from "react-dom";
import App from "./App";
import 'antd/dist/antd.css'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_SUPA;
// Request
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken && config.headers) {
      config.headers["Content-Type"] = `application/json`;
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  if(error.response.status == 401){
    localStorage.removeItem("token");
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

const rootElement = document.getElementById("root");
ReactDOM.render(
  <App />,
  rootElement
);
