import { combineReducers } from 'redux';
import authReducer from './authReducer';

let reducers = combineReducers({
  authReducer,
});

export default reducers
export type RootState = ReturnType<typeof reducers>
