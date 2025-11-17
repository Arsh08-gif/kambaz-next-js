"use client";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
export default function CoursesLayout(
    // { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>
    { children }: { children: ReactNode }
) {
    const { cid } = useParams();
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const course = courses.find((course) => course._id === cid);

    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify className="me-4 fs-4 mb-1" />
                {course?.name}
                <Breadcrumb course={course} /> </h2> <hr />
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <CourseNavigation course={course} />
                </div>
                <div className="flex-fill">
                    {children}
                </div></div>
        </div >


    );
}

