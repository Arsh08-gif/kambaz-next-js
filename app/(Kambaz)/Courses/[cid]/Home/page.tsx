"use client"
import { log } from "console";
import Modules from "../Modules/page";
import CourseStatus from "./Status";
import { useParams } from "next/navigation";

export default function Home() {
    const { cid } = useParams();
    console.log("cid Home: " + cid)
    return (
        <div id="wd-home">
            <div className="d-flex" id="wd-home">
                <div className="flex-fill me-3">
                    <Modules />
                </div>
                <div className="d-none d-xl-block">
                    <CourseStatus />
                </div>
            </div>
        </div >

    );
}

