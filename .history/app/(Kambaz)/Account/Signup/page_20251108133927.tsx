
import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    return (
        <div id="wd-signup-screen">
            <h1>Sign up</h1>
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





