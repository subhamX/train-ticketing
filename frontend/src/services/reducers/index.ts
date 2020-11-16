import { combineReducers } from 'redux';
import authReducer from './authReducer';
import stateReducer from './stateReducer';
import trainsReducer from './trainsReducer';
import ticketsReducer from './ticketsReducer';


let reducers = combineReducers({
  authReducer,
  stateReducer,
  trainsReducer,
  ticketsReducer
});

export default reducers
export type RootState = ReturnType<typeof reducers>
