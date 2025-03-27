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
    axios.post(`http://127.0.0.1:8000/auth/reset_password/`, { email, new_password: newPassword }).then((res) => res.data);


export const loginStudent = async (email,password) => {
  return axios.post(`${API_URL}/login/student/`,{email,password});
};



export const fetchTestDetails = async (testId, token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/portal/test/${testId}/details/`, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching test details:", error);
    throw error;
  }
};

export const submitTestAnswers = async (testId, answers, token) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/portal/test/${testId}/submit/`,
      { responses: answers },
      { headers: { Authorization: `Token ${token}`,
      "Content-Type": "application/json", 

     } },
      
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error;
  }
};


const BASE_URL = "http://127.0.0.1:8000/portal/test/";

export const activateTest = async (testId,token) => {
  try {
    const response = await fetch(`${BASE_URL}${testId}/activate/`, {
      method: "PATCH",
       headers: { Authorization: `Token ${token}` } 
      ,
    });
    return await response.json();
  } catch (error) {
    console.error("Error activating test:", error);
    throw error;
  }
};

export const deactivateTest = async (testId,token) => {
  try {
    const response = await fetch(`${BASE_URL}${testId}/deactivate/`, {
      method: "PATCH",
      headers: { Authorization: `Token ${token}` } 

    });
    return await response.json();
  } catch (error) {
    console.error("Error deactivating test:", error);
    throw error;
  }
};

export const fetchTestStatus = async (testId,token) => {
  try {
    const response = await fetch(`${BASE_URL}${testId}/status/`, {
      method: "GET",
      headers: { Authorization: `Token ${token}` } 
      ,
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching test status:", error);
    throw error;
  }
};


export const createTestSet = async (testId, orderType, questionsPerPage,token) => {
  try {
    const response = await fetch(`${BASE_URL}${testId}/test-set/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}`,
    "Content-Type": "application/json" } ,
      body: JSON.stringify({ order_type: orderType, questions_per_page: questionsPerPage }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating test set:", error);
    throw error;
  }
};



// Fetch all descriptive questions & responses
export const fetchDescriptiveQuestions = async (testId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/portal/test/${testId}/descriptive/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// Submit marks for grading
export const submitMarks = async (testId, responses, token) => {
  const response = await axios.post(
    `http://127.0.0.1:8000/portal/test/${testId}/descriptive/`,
    { responses },
    { headers: { Authorization: `Token ${token}` } }
  );
  return response.data;
};