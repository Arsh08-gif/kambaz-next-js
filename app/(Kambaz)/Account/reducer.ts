import { createSlice } from "@reduxjs/toolkit";
import users from "../Database/users";
import enrollments from "../Database/enrollments";

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

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface AccountState {
  currentUser: User | null;
  users: User[];
  enrollments: Enrollment[];

}

const initialState: AccountState = {
  currentUser: null,
  users: users,
  enrollments: enrollments

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
      const userId = new Date().getTime().toString();

      const newUser: User = {
        _id: userId,
        username: action.payload.username,
        password: action.payload.password,
        firstName: action.payload.firstName || "",
        lastName: action.payload.lastName || "",
        email: action.payload.email || "",
        dob: action.payload.dob || "",
        role: action.payload.role || "STUDENT",
        loginId: action.payload.loginId || "",
        section: action.payload.section || "",
        lastActivity: new Date().toISOString().split('T')[0],
        totalActivity: "00:00:00"
      };
      state.users.push(newUser);
      const enrollment: Enrollment = {
        _id: `${userId}_RS101_${Date.now()}`,
        user: userId,
        course: "RS101"
      };
      state.enrollments.push(enrollment);
      console.log("signup state : " + JSON.stringify(state.users));
    },

    enrollCourse: (state, action) => {
      const { userId, courseId } = action.payload;
      console.log("enroll courses " + userId, courseId);

      const alreadyEnrolled = state.enrollments.some(
        (enrollment) => enrollment.user === userId && enrollment.course === courseId
      );
      console.log("already enrolled " + alreadyEnrolled);


      if (!alreadyEnrolled) {
        const newEnrollment: Enrollment = {
          _id: `${userId}_${courseId}_${Date.now()}`,
          user: userId,
          course: courseId
        };
        state.enrollments.push(newEnrollment);
        console.log("Enrolled in course:", courseId);
        console.log("enrollements : " + JSON.stringify(state.enrollments));

      }
    },
    unenrollCourse: (state, action) => {
      const { userId, courseId } = action.payload;

      state.enrollments = state.enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
      );

      console.log("Unenrolled from course:", courseId);
    },
    addEnrollment: (state, { payload: enrollment }) => {
      state.enrollments.push(enrollment);
    },
    setEnrollments: (state, { payload: enrollements }) => {
      state.enrollments = enrollements;
    }
  },
});
export const { setCurrentUser, signup, enrollCourse, unenrollCourse, addEnrollment, setEnrollments} = accountSlice.actions;
export default accountSlice.reducer;

