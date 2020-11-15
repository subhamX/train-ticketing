import { combineReducers } from 'redux';
import authReducer from './authReducer';
import stateReducer from './stateReducer';
import trainsReducer from './trainsReducer';

let reducers = combineReducers({
  authReducer,
  stateReducer,
  trainsReducer
});

export default reducers
export type RootState = ReturnType<typeof reducers>
