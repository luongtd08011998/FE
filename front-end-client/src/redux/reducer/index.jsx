import { combineReducers } from "redux";
import userReducer from "./userReducer.jsx";

const mainReducer = combineReducers({
  user: userReducer,
});

export default mainReducer;
