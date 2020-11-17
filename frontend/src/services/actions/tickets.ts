import { message } from "antd";
import { Dispatch } from "redux";
import { cancelTickets, getAllTickets, getCitiesList, getTicketsInfo, CancelTicketSchema } from "../api";
import { FETCH_CITIES, TICKETS_LIST_LOADING, TICKET_INFO_FETCH_SUCCESS, FETCHING_TICKET_INFO, TICKETS_LIST_LOADED, CANCEL_TICKET_START, CANCEL_TICKET_SUCCESS } from "../constants";


/**
 * Action to get cities
 */
export const getCities = () => async (dispatch: Dispatch) => {
    try {
        let resp = await getCitiesList();
        dispatch({ type: FETCH_CITIES, cities: resp.data.cities })
    } catch (err) {
        console.log(err);
        message.error('Error in fetching cities', 2);
    }
}

/**
 * Action to get all tickets
 */

export const getAllTicketsAction = () => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: TICKETS_LIST_LOADING })
        let resp = await getAllTickets();
        dispatch({ type: TICKETS_LIST_LOADED, tickets: resp.data.tickets })
    } catch (err) {
        console.log(err);
        message.error('Error in fetching all tickets', 2);
    }
}

/**
 * Action to fetch ticket info
 */
export const getTicketsInfoAction = (pnrNumber: string) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: FETCHING_TICKET_INFO, pnrNumber });
        let resp = await getTicketsInfo(pnrNumber);
        if (resp.data.error) {
            throw Error(resp.data.message);
        }
        dispatch({ type: TICKET_INFO_FETCH_SUCCESS, pnrNumber, data: resp.data });
    } catch (err) {
        console.log(err);
        message.error('Error in fetching ticket info', 2);
    }
}

/**
 * Action to cancel tickets
 */

export const cancelTicketsAction = (payload: CancelTicketSchema) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: CANCEL_TICKET_START, pnrNumber: payload.pnr_number })
        let resp = await cancelTickets(payload);
        if (resp.data.error) {
            throw Error(resp.data.message);
        }
        message.success('Ticket Cancellation Success', 2);
        dispatch({ type: CANCEL_TICKET_SUCCESS, pnrNumber: payload.pnr_number, delBerths: payload.seats })
        // successful;
    } catch (err) {
        console.log(err);
        message.error('Something went wrong while cancelling the ticket', 2);
    }
}