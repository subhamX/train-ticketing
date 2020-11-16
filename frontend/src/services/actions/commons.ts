import { Dispatch } from "redux";
import { ERROR_OCCURED } from "../constants";

// spinner loader
export const showLoadingSpinner = () => async (dispatch: Dispatch) => {
    dispatch({ type: 'SHOW_PROGRESS', message: 'Loading...' });
}

export const showErrorPage = (message: string) => async (dispatch: Dispatch) => {
    dispatch({ type: ERROR_OCCURED, message });
}
