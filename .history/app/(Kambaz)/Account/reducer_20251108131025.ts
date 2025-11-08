import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      console.log("current user : " + state.currentUser);
      state.currentUser = action.payload;
      console.log("current user after state : " + );
      
    },
  },
});
export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;

