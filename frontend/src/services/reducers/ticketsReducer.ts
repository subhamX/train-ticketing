import { FETCHING_TICKET_INFO, CANCEL_TICKET_START, CANCEL_TICKET_SUCCESS, FETCH_CITIES, TICKETS_LIST_LOADED, TICKETS_LIST_LOADING, TICKET_INFO_FETCH_SUCCESS } from '../constants';

export interface StateStore {
    cities: [],
    tickets_list_loading: boolean,
    tickets: [],
    berths: {},
    loadingTickets: [],
    isCancellingTicket: []
}

// Reducer
const initState: StateStore = {
    cities: [],
    tickets_list_loading: false,
    tickets: [],
    berths: {},
    loadingTickets: [],
    isCancellingTicket: []
};

let ticketsReducer = (state = initState, action: any) => {
    switch (action.type) {
        case FETCH_CITIES:
            return { ...state, cities: action.cities }
        case TICKETS_LIST_LOADING:
            return { ...state, tickets_list_loading: true }
        case TICKETS_LIST_LOADED:
            return { ...state, tickets: action.tickets, tickets_list_loading: false }
        case FETCHING_TICKET_INFO: {
            return { ...state, loadingTickets: [...state.loadingTickets, action.pnrNumber] }
        } case TICKET_INFO_FETCH_SUCCESS: {
            let newLoadingList = state.loadingTickets.filter(e => {
                return e !== action.pnrNumber;
            })
            let berths: any = {
                ...state.berths,
            }
            berths[action.pnrNumber] = action.data.berths;
            return { ...state, loadingTickets: newLoadingList, berths }
        } case CANCEL_TICKET_START: {
            return { ...state, isCancellingTicket: [...state.isCancellingTicket, action.pnrNumber] };
        } case CANCEL_TICKET_SUCCESS: {
            let newLoadingList = state.isCancellingTicket.filter(e => {
                return e !== action.pnrNumber;
            })
            let berths: any = {
                ...state.berths,
            }
            let newTickets: any = state.tickets.map((ticket: any) => {
                if (ticket.pnr_number === action.pnrNumber) {
                    ticket.refund_amount = action.new_refund_amount;
                }
                return ticket;
            });

            // newTickets[action.pnrNumber]['refund_amount'] = ;
            // we can assume that the berths[action.pnrNumber] is defined
            berths[action.pnrNumber] = berths[action.pnrNumber].map((f: any) => {
                let resp = action.delBerths.find((e: { seat_number: number, coach_number: string }) => {
                    return e.seat_number === f.seat_number && e.coach_number === f.coach_number;
                });
                if (resp !== undefined) {
                    f.is_cancelled = 1;
                }
                return f;
            })
            return { ...state, isCancellingTicket: newLoadingList, berths, tickets: newTickets }
        }
        default: {
            return state;
        }
    }
};

export default ticketsReducer;
