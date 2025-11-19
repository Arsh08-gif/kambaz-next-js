import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const USERS_API = `${HTTP_SERVER}/api/users`;

interface User {
    _id: string;
    username: string;
    password: string;
    firstName?: string;
};

interface Credentials {
    username: string;
    password: string;
}

export const signin = async (credentials: Credentials) => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
        return response.data;
    }
    catch (err : any) {
        console.error("Signin error:", err.response?.data);
        throw err;
    }
};
export const signup = async (user: User) => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
        return response.data;
    }
    catch (err : any) {
        console.error("Signup error:", err.response?.data);
        //console.error("Signup error:", err);
        throw err;
    }
};
export const updateUser = async (user: User) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
    return response.data;
};
export const profile = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
    return response.data;
};
export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};






