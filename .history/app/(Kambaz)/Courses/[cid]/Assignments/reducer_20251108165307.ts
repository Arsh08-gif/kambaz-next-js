import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

export interface Assignment {
    _id: string;
    title: string;
    course: string;
    description: string;
    points: number;
    available_date: string;
    due_date: string;
    until: string;
}

const initialState = {
    assignments: assignments as Assignment[],
    //assignments: assignments
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        addAssignment: (state, { payload: assignment }) => {
            console.log("inside add..");
            console.log("assignments : " + JSON.stringify(state.assignments));

            const newAssignment: Assignment = {
                _id: uuidv4(),
                title: assignment.title,
                course: assignment.course,
                description: assignment.description || "",
                points: assignment.points || 0,
                available_date: assignment.available_date || "",
                due_date: assignment.due_date || "",
                until: assignment.until || "",
            };

            console.log("new assignment : " + newAssignment.title);

            state.assignments = [newAssignment, ...state.assignments];
            console.log("new state : " + JSON.stringify(state.assignments));

        },
        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter(
                (a) => a._id !== assignmentId);
        },
        updateAssignment: (state, { payload: assignment }) => {
            console.log("update..");
            console.log("assignments : " + JSON.stringify(state.assignments));

            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? assignment : a
            );

            console.log("updated assign : " + JSON.stringify(state.assignments));

        },
        editAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignmentId ? { ...a, editing: true } : a
            ) as any;
        },
    },
});
export const { addAssignment, deleteAssignment, updateAssignment } =
    assignmentsSlice.actions;
export default assignmentsSlice.reducer;