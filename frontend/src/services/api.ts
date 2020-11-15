
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

export const getTrainsList = () => axios.get(`${url}/trains/list/`, { withCredentials: true });

export const loginUser = (payload: any) => axios.post(
    `${process.env.REACT_APP_SERVER_URL}/auth/login`,
    payload,
    {
        withCredentials: true
    }
);

export const getTrainInstancesList = (trainNumber: any) => axios.get(`${url}/trains/info/${trainNumber}`, { withCredentials: true });

export const addNewTrain = (payload: { ac_ticket_fare: String; sleeper_ticket_fare: String; train_number: String; train_name: String; source: String; destination: String, source_departure_time: String, journey_duration: String }) => axios.post(`${url}/admin/trains/add/`, payload, { withCredentials: true });

export const addNewBookingInstance = (payload: { train_number: String; journey_date: String, booking_start_time: String; booking_end_time: String, sleeper_coach_id: String, ac_coach_id: String, number_of_sleeper_coaches: Number, number_of_ac_coaches: Number, }) => axios.post(`${url}/admin/addbookinginstance/`, payload, { withCredentials: true });

export const addNewCoach = (payload: { name: String; description: String, composition: {berth_number: Number, berth_type: String}[]; }) => axios.post(`${url}/admin/coaches/add/`, payload, { withCredentials: true });


