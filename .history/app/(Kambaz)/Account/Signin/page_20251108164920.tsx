"use client";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import { setCurrentUser, User } from "../reducer";
import { useDispatch, useSelector } from "react-redux";
import { use, useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";
import { log } from "console";
import { RootState } from "../../store";


export default function Signin() {
    interface Credentials {
        username: string;
        password: string;
    }
    const [credentials, setCredentials] = useState<any>({});
    console.log("credentials user " + credentials.username)
    console.log("credentials pwd " + credentials.password)
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.accountReducer.users);
    //const router = useRouter();
    // const signin = () => {
    //     const user = db.users.find(
    //         (u: any) =>
    //             u.username === credentials.username &&
    //             u.password === credentials.password
    //     );
    //     console.log("user pwd : " + user?.password)
    //     console.log("user name : " + user?.username)
    //     console.log("signed in user: " + user)
    //     if (!user) return;
    //     dispatch(setCurrentUser(user));
    //     redirect("/Dashboard");
    //     //router.push("/Dashboard");
    // };

    const signin = () => {
        const user = users.find(
            (u: User) =>
                u.username === credentials.username &&
                u.password === credentials.password
        );
        console.log("user pwd : " + user?.password)
        console.log("user name : " + user?.username)
        console.log("signed in user: " + user)
        if (!user) return;
        dispatch(setCurrentUser(user));
        redirect("/Dashboard");
        //router.push("/Dashboard");
    };

    return (
        <div id="wd-signin-screen">
            <h1>Sign in</h1>
            <FormControl defaultValue={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                id="wd-username"
                placeholder="username"
                className="mb-2" />
            <FormControl defaultValue={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                id="wd-password"
                placeholder="password" type="password"
                className="mb-2" />
            <Button onClick={signin} id="wd-signin-btn"
                className="btn btn-primary w-100 mb-2">
                Sign in </Button>
            <Link id="wd-signup-link"
                href="/Account/Signup"
                className="btn btn-primary w-100 mb-2">
                Sign up </Link>

        </div>);
}



