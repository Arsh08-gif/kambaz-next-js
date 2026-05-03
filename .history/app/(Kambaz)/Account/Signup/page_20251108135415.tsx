"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
//import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormControl } from "react-bootstrap";
import { signup } from "../reducer";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    //const router = useRouter();
    
    const handleSignup = () => {
    // Validation
    if (!username || !password || !verifyPassword) {
      setError("All fields are required");
      return;
    }
    
    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    // Create new user
    const newUser = {
      username,
      password,
      firstName: "",
      lastName: "",
      email: "",
    };

    dispatch(signup(newUser));
    
     Redirect to signin
    //router.push("/Signin");
  };
    return (
        <div id="wd-signup-screen">
            <h1>Sign up</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <FormControl id="wd-username"
                placeholder="username"
                className="mb-2" />
            <FormControl id="wd-password"
                placeholder="password" type="password"
                className="mb-2" />
            <FormControl id="wd-password"
                placeholder="verify password" type="password"
                className="mb-2" />
            <Link id="wd-signup-btn"
                href="Profile"
                className="btn btn-primary w-100 mb-2">
                Sign up </Link>
            <Link id="wd-signin-btn"
                href="Signin"
                className="btn btn-primary w-100 mb-2">
                Sign in </Link>
        </div>);
}





