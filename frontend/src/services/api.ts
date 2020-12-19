
import axios from 'axios';

let url = `${process.env.NODE_ENV==='development' ? process.env.REACT_APP_DEV_SERVER_URL : process.env.REACT_APP_SERVER_URL}`;
if(url==='undefined')
    url='';
if(url.substr(-1)!=='/')
    url+='/';
url+='api';

export const getUserData = () => axios.get(`${url}/users/profile/`, { withCredentials: true });

export const sendLogOutSignal = () => axios.post(`${url}/auth/logout/`, {}, { withCredentials: true });

export const registerUser = (payload: any) => axios.post(
    `${url}/auth/register`,
    payload,
    {
        withCredentials: true,
    }
);

export const getTrainsList = () => axios.get(`${url}/trains/list/`, { withCredentials: true });

export const loginUser = (payload: any) => axios.post(
    `${url}/auth/login`,
    payload,
    {
        withCredentials: true
    }
);

export const getCitiesList = () => axios.get(`${url}/cities/all/`, { withCredentials: true });

export const getTrainInstancesList = (trainNumber: any) => axios.get(`${url}/trains/info/${trainNumber}/`, { withCredentials: true });

export const addNewTrain = (payload: { ac_ticket_fare: String; sleeper_ticket_fare: String; train_number: String; train_name: String; source: String; destination: String, source_departure_time: String, journey_duration: String }) => axios.post(`${url}/admin/trains/add/`, payload, { withCredentials: true });

export const addNewBookingInstance = (payload: { train_number: String; journey_date: String, booking_start_time: String; booking_end_time: String, sleeper_coach_id: String, ac_coach_id: String, number_of_sleeper_coaches: Number, number_of_ac_coaches: Number, }) => axios.post(`${url}/admin/addbookinginstance/`, payload, { withCredentials: true });

export const addNewCoach = (payload: { name: String; description: String, composition: { berth_number: Number, berth_type: String }[]; }) => axios.post(`${url}/admin/coaches/add/`, payload, { withCredentials: true });

export const queryTrainsInstances = (payload: { source: String; destination: String, date: String }) => axios.get(`${url}/trains/current/active/?source=${payload.source}&destination=${payload.destination}&date=${payload.date}`, { withCredentials: true });


export interface BookTicketSchema {
    ticket_fare: number;
    journey_date: Date;
    train_number: String;
    transaction_number: String;
    type: String;
    passengers: {
        passenger_age: Number;
        passenger_name: String;
        passenger_gender: String;
    };
    booking_type: Number;
}
export const bookTicket = (payload: BookTicketSchema) => axios.post(`${url}/tickets/book/`, payload, { withCredentials: true });


export const getAllTickets = () => axios.get(`${url}/tickets/all/`, { withCredentials: true });

export const getTicketsInfo = (pnrNumber:string) => axios.get(`${url}/tickets/info/${pnrNumber}`, { withCredentials: true });

export interface CancelTicketSchema{
    pnr_number: string;
    seats: [{ seat_number: Number, coach_number: String }]
}
export const cancelTickets = (payload: CancelTicketSchema) => axios.post(`${url}/tickets/cancel/`, payload, { withCredentials: true });
