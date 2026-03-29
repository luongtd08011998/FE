import axios from "axios";

const BASE_URL = "http://localhost:8080/auth";

export const login = async (dataLogin) => {
    try {
        const response = await axios.post(`${BASE_URL}/access`, dataLogin);
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export const register = async (dataRegister) => {
    try {
        const response = await axios.post(`http://localhost:8080/auth/register`, dataRegister);
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(
            `http://localhost:8080/auth/refresh`,
            {},
            {
                headers: {
                    'x-token': refreshToken,
                }
            }
        );
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
}


export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export const verifyOtpForgotPassword = async (email, otp) => {
    try {
        const response = await axios.post(`${BASE_URL}/verify-otp-forgot-password`, { email, otp });
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export const verifyOtpRegister = async (email, otp) => {
    try {
        const response = await axios.post(`${BASE_URL}/verify-otp-register`, { email, otp });
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
}
export const oauthLogin = async (dataLogin) => {
    try {
        const response = await axios.post(
            "http://localhost:8080/auth/oauth/login",
            dataLogin
        );
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};