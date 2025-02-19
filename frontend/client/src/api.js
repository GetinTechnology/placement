import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth/";

export const register = (email, password) => {
    return axios.post(`${API_URL}register/`, { email, password });
};

export const login = (email, password) => {
    return axios.post(`${API_URL}login/`, { email, password });
};

export const verifyCode = (email, code) => {
    return axios.post(`${API_URL}verify/`, { email, code });
};

const token = localStorage.getItem("authToken");
fetch("http://127.0.0.1:8000/portal/test/", {
  method: "GET",
  headers: {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }
}).then((d)=>{
    return d.json()
}).then((e)=>{
    console.log(e)
}).catch((f)=>{
    console.log(f)
})