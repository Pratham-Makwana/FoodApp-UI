import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './reducer/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
