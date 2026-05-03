import { createSlice } from "@reduxjs/toolkit";

interface AccountState {
    currentUser: User | null;
}

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
      console.log("current user after state : " + JSON.stringify(state.currentUser));
      
    },
  },
});
export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;

