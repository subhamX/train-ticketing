import { Dispatch } from "redux";

// spinner loader
export const showLoadingSpinner = () => async (dispatch:Dispatch) => {
    dispatch({type: 'SHOW_PROGRESS', message: 'Loading...'});
}

