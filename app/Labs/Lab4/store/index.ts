import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "../ReduxExamples/HelloRedux/helloReducer";
const store = configureStore({
  reducer: { helloReducer }});
export default store;

export type RootState = ReturnType<typeof store.getState>;
