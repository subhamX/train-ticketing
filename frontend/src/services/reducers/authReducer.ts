import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../constants';

export interface StoreState {
    user?: {
        username: string
        email: string
        first_name: string
        last_name: string
        is_admin: boolean
    }
}

// Reducer
const initState: StoreState = {
    user: undefined
};

let authReducer = (state = initState, action: any) => {
    switch (action.type) {
        case LOGIN_SUCCESS: {
            // accepts the user and updates the store
            return { ...initState, user: action.payload };
        } case LOGOUT_SUCCESS: {
            // removes the current user
            return { ...initState, user: undefined }
        } default: {
            return state;
        }
    }
};

export default authReducer;
