import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './reducer/userSlice';
import cartReducer from './reducer/cardSice';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

export default rootReducer;
