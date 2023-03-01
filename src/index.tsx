import axios from "axios";
import ReactDOM from "react-dom";
import App from "./App";
import 'antd/dist/antd.css'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_SUPA;

// Request
axios.interceptors.request.use(
  (config: any) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
    config.headers["Content-Type"] = `application/json`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
// Response
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.log(error.response.status)
    if (error.response.status == 401) {
      const { data: response } = await axios.post(`auth/refreshwebtoken`, {"refresh_token": localStorage.getItem("refresh_token")});
      if(response.code == 200){
        localStorage.setItem("access_token", response.data);
        const originalRequest = error.config;
        return axios(originalRequest);
      }else{
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");
        location.href = "/login"
      }
    }
    return Promise.reject(error);
  }
);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <App />,
  rootElement
);
