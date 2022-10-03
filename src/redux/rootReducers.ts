import { AnyAction, combineReducers } from "@reduxjs/toolkit";
import { Reducer } from "react";

import accountReducer from "./accounts/account.slices";

const rootReducer = combineReducers({
  account: accountReducer,
});

export default rootReducer;
