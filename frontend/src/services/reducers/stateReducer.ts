import { LOADING_BEGIN, LOADING_END, ERROR_OCCURED } from '../constants';

export interface StateStore {
    isLoading: boolean,
    message: string,
    error: boolean,
}

// Reducer
const initState: StateStore = {
    isLoading: true,
    message: "",
    error: false
};

let statusReducer = (state = initState, action: any) => {
    switch (action.type) {
        case LOADING_BEGIN: {
            return { ...initState, isLoading: true, message: action.message };
        } case LOADING_END: {
            return { ...initState, isLoading: false, message: "" };
        } case ERROR_OCCURED:{
            return { ...initState, error: true, message: action.message };
        } default: {
            return state;
        }
    }
};

export default statusReducer;
