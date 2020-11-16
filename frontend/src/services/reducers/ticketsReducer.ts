import { FETCH_CITIES } from '../constants';

export interface StateStore {
    cities: []
}

// Reducer
const initState: StateStore = {
    cities: []
};

let statusReducer = (state = initState, action: any) => {
    switch (action.type) {
        case FETCH_CITIES:
            return { ...state, cities: action.cities }
        default: {
            return state;
        }
    }
};

export default statusReducer;
