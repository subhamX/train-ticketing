import { combineReducers } from 'redux';
import authReducer from './authReducer';
import stateReducer from './stateReducer';
let reducers = combineReducers({
  authReducer,
  stateReducer
});

export default reducers
export type RootState = ReturnType<typeof reducers>
