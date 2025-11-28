import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENT_API = `${HTTP_SERVER}/api/assignements`

type Course = {
  _id: string;
  name: string;
  number: string;
  image: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
};
interface User {
  _id: string;
  username: string;
  password: string;
  firstName?: string;
};
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

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};
// export const findMyCourses = async () => {
//   try {
//     const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
//     return data;
//   }
//   catch (err:any) {
//     console.log("findMyCourse err " + err.data);

//   }
// };
export const createCourse = async (course: Course) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: Course) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

// export const enrollCourse = async (userId: string, courseId: string) => {
//   const response = await axios
//     .post(`${COURSES_API}/${userId}/${courseId}/enrollments`)
//   return response.data
// }

// export const unEnrollCourse = async (userId: string, courseId: string) => {
//   const response = await axios
//     .delete(`${COURSES_API}/${userId}/${courseId}/enrollments`)
//   return response.data
// }

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};


export const getUserEnrollments = async (userId: string) => {
  const response = await axios.get(`${USERS_API}/${userId}/enrollments`);
  return response.data;
};
export const findCoursesForEnrolledUser = async (userId: string) => {
  const response = await axios.get(`${USERS_API}/${userId}/courses`);
  return response.data;
};
export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axios
    .get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModuleForCourse = async (courseId: string, module: Module) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const fetchCoursesByIds = async (ids: string[]) => {
  const response = await axiosWithCredentials.post(`${COURSES_API}/batch`, { ids });
  return response.data;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const response = await axios.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
  return response.data;
};

export const updateModule = async (courseId: string, module: Module) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
  return data;
};

export const findAssignementForCourse = async (courseId: string) => {
  const response = await axios
    .get(`${COURSES_API}/${courseId}/assignements`)
  return response.data;
}

export const createAssingmentForCourse = async (courseId: string, assignement: Assignment) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/assignements`,
    assignement
  );
  return response.data;
};

export const deleteAssignment = async (assignementId: string) => {
  const response = await axios.delete(`${ASSIGNMENT_API}/${assignementId}`);
  return response.data;
};


export const updateAssignment = async (assignement: Assignment) => {
  const { data } = await axios.put(`${ASSIGNMENT_API}/${assignement._id}`, assignement);
  return data;
};













