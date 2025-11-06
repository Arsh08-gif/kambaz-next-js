import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentReducer from "./Courses/[cid]/Assignments/reducer";

const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    accountReducer,
    assignmentReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;

