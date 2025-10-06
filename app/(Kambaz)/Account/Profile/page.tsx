import Link from "next/link";
import { FormControl, FormSelect } from "react-bootstrap";
export default function Profile() {
    return (
        <div id="wd-profile-screen">
            <h1>Profile</h1>
            <FormControl id="wd-username"
                placeholder="username"
                defaultValue={"alice"}
                className="mb-2" />
            <FormControl id="wd-password"
                placeholder="password"
                defaultValue={"123"}
                type="password"
                className="mb-2" />

            <FormControl id="wd-firstname"
                placeholder="First Name"
                defaultValue={"Alice"}
                type="text"
                className="mb-2" />

            <FormControl id="wd-lastname"
                placeholder="Last Name"
                defaultValue={"Wonderland"}
                type="text"
                className="mb-2" />

            <FormControl id="wd-dob"
                placeholder="DOB" type="date"
                defaultValue={"2000-01-01"}
                className="mb-2" />

            <FormControl id="wd-email"
                placeholder="Email" type="email"
                defaultValue={"alice@wonderland"}
                className="mb-2" />

            <FormSelect defaultValue={"FACULTY"}>
                <option value="USER" >User</option>
                <option value="ADMIN" >Admin</option>
                <option value="FACULTY" >Faculty</option>
                <option value="STUDENT" >Student</option>
            </FormSelect>

            <Link id="wd-signin-btn"
                href="/Account/Profile"
                className="btn btn-danger w-100 mb-2 mt-2">
                Sign Out </Link>
        </div>);
}




