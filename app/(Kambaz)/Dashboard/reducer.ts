import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//import db from "../Database";
import enrollments from "../../../../kambaz-node-server-app/Database/enrollments";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentsState = {
  // enrollments: db.enrollments,
  enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollInCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      const { userId, courseId } = action.payload;
      const alreadyEnrolled = state.enrollments.some(
        (enrollment) => enrollment.user === userId && enrollment.course === courseId
      );
      
      if (!alreadyEnrolled) {
        const newEnrollment: Enrollment = {
          _id: `${userId}-${courseId}-${Date.now()}`,
          user: userId,
          course: courseId,
        };
        state.enrollments.push(newEnrollment);
      }
    },
    
    unenrollFromCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      const { userId, courseId } = action.payload;
      state.enrollments = state.enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
      );
    },
    
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
  },
});

export const { enrollInCourse, unenrollFromCourse, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;