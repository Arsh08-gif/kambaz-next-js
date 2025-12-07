"use client";
import * as client from "../client";
import { redirect } from "next/dist/client/components/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { toast, ToastContainer } from 'react-toastify';
import { Button, FormControl } from "react-bootstrap";
export default function Profile() {
    interface Profile {
        _id: string;
        username: string;
        password: string;
        firstName: string;
        lastName: string;
        dob: string;
        email: string;
        role: string;
    }
    const [profile, setProfile] = useState<Profile>({
        _id: Date.now().toString(),
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        role: "",
    });
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);

    const isAdmin = currentUser?.role === "ADMIN";
    const fetchProfile = () => {
        console.log("current user profile " + JSON.stringify(currentUser));

        if (!currentUser) return redirect("/Account/Signin");
        setProfile(currentUser);
    };

    const updateProfile = async () => {
        const updatedProfile = await client.updateUser(profile);
        if (updatedProfile) {
            toast.success("profile updated!!", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
            alert("profile updated!!")
        }
        dispatch(setCurrentUser(updatedProfile));
    };

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        redirect("/Account/Signin");
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    return (
        <div className="wd-profile-screen">
            <ToastContainer />
            <h3>Profile</h3>
            {profile && (
                <div>
                    <FormControl id="wd-username" className="mb-2"
                        defaultValue={profile.username}
                        placeholder="Enter username"
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
                    <FormControl id="wd-password" className="mb-2"
                        defaultValue={profile.password}
                        placeholder="Enter password"
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
                    <FormControl id="wd-firstname" className="mb-2"
                        defaultValue={profile.firstName}
                        placeholder="Enter First Name"
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                    <FormControl id="wd-lastname" className="mb-2"
                        defaultValue={profile.lastName}
                        placeholder="Enter Last Name"
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                    <FormControl id="wd-dob" className="mb-2" type="date"
                        defaultValue={profile.dob}
                        placeholder="Enter dob"
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
                    <FormControl id="wd-email" className="mb-2"
                        defaultValue={profile.email}
                        placeholder="Enter email"
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    {isAdmin && (
                        <>
                            <select className="form-control mb-2" id="wd-role"
                                value={profile.role}
                                onChange={(e) => setProfile({ ...profile, role: e.target.value })} >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="FACULTY">Faculty</option>{" "}
                                <option value="STUDENT">Student</option>
                            </select>
                        </>
                    )}
                    <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
                    <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
                        Sign out
                    </Button>
                </div>
            )}
        </div>
    );
}
