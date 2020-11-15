import { TRAIN_LOADING, FETCH_TRAINS_SUCCESS, TRAIN_INSTANCE_LOADING, TRAIN_INSTANCE_LOADING_SUCCESS } from '../constants';

export interface TrainsStore {
    trains: [],
    fetching_trains: boolean;
    instances: {},
    train_instances_loading: []
}

// Reducer
const initState: TrainsStore = {
    trains: [],
    fetching_trains: true,
    instances: {},
    train_instances_loading: []
};

let trainsReducer = (state = initState, action: any) => {
    switch (action.type) {
        case TRAIN_LOADING: {
            return { ...state, fetching_trains: true };
        } case FETCH_TRAINS_SUCCESS: {
            return { ...state, fetching_trains: false, trains: action.trainsList };
        } case TRAIN_INSTANCE_LOADING: {
            return { ...state, train_instances_loading: [...state.train_instances_loading, action.trainNumber] }
        } case TRAIN_INSTANCE_LOADING_SUCCESS: {
            let new_train_instances_loading = state.train_instances_loading.map((e) => {
                return e !== action.trainNumber;
            })
            let trainNumber: string = action.trainNumber;
            let newInstances: any = { ...state.instances }
            newInstances[trainNumber] = action.trainInstances;

            return { ...state, train_instances_loading: new_train_instances_loading, instances: newInstances }
        } default: {
            return state;
        }
    }
};



export default trainsReducer;
