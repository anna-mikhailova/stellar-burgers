import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients-slice';
import burgerConstructorReducer from './slices/burger-constructor-slice';
import feedReducer from './slices/feed-slice';
import ordersReducer from './slices/orders-slice';
import userReducer from './slices/user-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
  user: userReducer
});

export default rootReducer;
