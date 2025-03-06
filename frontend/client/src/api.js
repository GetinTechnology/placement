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


export const forgotPassword = (email) =>
    axios.post(`${API_URL}forgot_password/`, { email }).then((res) => res.data);
  
  export const verifyResetCode = (email, code) =>
    axios.post(`http://127.0.0.1:8000/auth/verify_reset_code/`, { email, code }).then((res) => res.data);
  
  export const resetPassword = (email, newPassword) =>
    axios.post(`${API_URL}/reset-password/`, { email, new_password: newPassword }).then((res) => res.data);


export const loginStudent = async (email,password) => {
  return axios.post(`${API_URL}/login/student/`,{email,password});
};