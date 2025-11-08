import { createSlice } from "@reduxjs/toolkit";

export interface User {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    role: string;
    loginId: string;
    section: string;
    lastActivity: string;
    totalActivity: string;
}

interface AccountState {
    currentUser: User | null;
    users : User[]
    
}

const initialState : AccountState = {
  currentUser: null,
  users : []
  
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
    signup: (state, action) => {
      console.log("action signup : " + JSON.stringify(action));
      
      const newUser: User = {
        _id: new Date().getTime().toString(), // Generate unique ID
        username: action.payload.username,
        password: action.payload.password,
        firstName: action.payload.firstName || "",
        lastName: action.payload.lastName || "",
        email: action.payload.email || "",
        dob: action.payload.dob || "",
        role: action.payload.role || "STUDENT", // Default role
        loginId: action.payload.loginId || "",
        section: action.payload.section || "",
        lastActivity: new Date().toISOString().split('T')[0],
        totalActivity: "00:00:00"
      };
      state.users.push(newUser);
      console.log("signup state : " + Js);
      
    }
  },
});
export const { setCurrentUser, signup } = accountSlice.actions;
export default accountSlice.reducer;

