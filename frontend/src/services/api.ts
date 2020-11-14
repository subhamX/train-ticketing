
import axios from 'axios';

const url = process.env.REACT_APP_SERVER_URL;

export const getUserData = () => axios.get(`${url}/users/profile/`, { withCredentials: true });

export const sendLogOutSignal = () => axios.post(`${url}/auth/logout/`, {}, { withCredentials: true });

export const registerUser = (payload: any) => axios.post(
    `${process.env.REACT_APP_SERVER_URL}/auth/register`,
    payload,
    {
        withCredentials: true,
    }
);

export const loginUser = (payload: any) => axios.post(
    `${process.env.REACT_APP_SERVER_URL}/auth/login`,
    payload,
    {
        withCredentials: true
    }
);