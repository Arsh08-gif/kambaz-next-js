"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { FormControl } from "react-bootstrap";
// import { signup } from "../reducer";
import * as client from "../client";

export default function Signup() {
    type User = {
        _id: string;
        username: string;
        password: string;
        firstName?: string;
    };
    const [user, setUser] = useState<any>({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();

    const handleSignup = async () => {
        try {
            console.log("inside signup");
            console.log("user " + JSON.stringify(user));
            const currentUser = await client.signup(user);
            console.log("current user signedup" + JSON.stringify(currentUser));

            dispatch(setCurrentUser(currentUser));
            redirect("/Account/Profile");
        }
        catch(err:any){
            alert(JSON.stringify(err.response?.data))
        }
    };
    return (
        <div id="wd-signup-screen">
            <h1>Sign up</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <FormControl value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="wd-username b-2" placeholder="username" />
            <FormControl value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="wd-password mb-2" placeholder="password" type="password" />
            <button onClick={handleSignup} className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </button><br />
            <Link href="/Account/Signin" id="wd-signin-link" className="btn btn-primary w-100 mb-2">Sign in</Link>

            {/* <button
                id="wd-signup-btn"
                onClick={handleSignup}
                className="btn btn-primary w-100 mb-2"
            >
                Sign up
            </button>
            <Link id="wd-signin-btn"
                href="Signin"
                className="btn btn-primary w-100 mb-2">
                Sign in </Link> */}
        </div>);
}





