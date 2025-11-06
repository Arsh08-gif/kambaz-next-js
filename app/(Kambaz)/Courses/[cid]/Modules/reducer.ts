import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

export interface Lesson {
  _id: string;
  name: string;
  description?: string;
  module: string;
}

export interface Module {
  _id: string;
  name: string;
  description?: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean; 
}

const initialState = {
    //modules: modules,
    modules: modules as Module[],
};
const modulesSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        addModule: (state, { payload: module }) => {
            const newModule: any = {
                _id: uuidv4(),
                lessons: [],
                name: module.name,
                course: module.course,
            };
            state.modules = [...state.modules, newModule] as any;
        },
        deleteModule: (state, { payload: moduleId }) => {
            state.modules = state.modules.filter(
                (m: any) => m._id !== moduleId);
        },
        updateModule: (state, { payload: module }) => {
            state.modules = state.modules.map((m: any) =>
                m._id === module._id ? module : m
            ) as any;
        },
        editModule: (state, { payload: moduleId }) => {
            state.modules = state.modules.map((m: any) =>
                m._id === moduleId ? { ...m, editing: true } : m
            ) as any;
        },
    },
});
export const { addModule, deleteModule, updateModule, editModule } =
    modulesSlice.actions;
export default modulesSlice.reducer;