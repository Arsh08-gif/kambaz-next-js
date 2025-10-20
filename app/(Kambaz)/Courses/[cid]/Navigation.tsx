import Link from "next/link";
import { ListGroupItem } from "react-bootstrap";
export default function CourseNavigation({ course }: { course: { _id:string,name: string } | undefined; }) {
    const links = [
        {
            path: `/Courses/${course?._id}/Home`,
            id: "wd-course-home-link",
            label: "Home",
            active: true,
        },
        {
            path: `/Courses/${course?._id}/Modules`,
            id: "wd-course-modules-link",
            label: "Modules",
        },
        {
            path: `/Courses/${course?._id}/Piazza`,
            id: "wd-course-piazza-link",
            label: "Piazza",
        },
        {
            path: `/Courses/${course?._id}/Zoom`,
            id: "wd-course-zoom-link",
            label: "Zoom",
        },
        {
            path: `/Courses/${course?._id}/Assignments`,
            id: "wd-course-assignments-link",
            label: "Assignments",
        },
        {
            path: `/Courses/${course?._id}/Quizzes`,
            id: "wd-course-quizzes-link",
            label: "Quizzes",
        },
        {
            path: `/Courses/${course?._id}/People/Table`,
            id: "wd-course-people-link",
            label: "People",
        },
    ];

    return (

        <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            {links.map((link) => (
                <ListGroupItem key={link.id}
                    as={Link}
                    href={link.path}
                    id={link.id}
                    className={`list-group-item border-0 ${link.active ? "active" : "text-danger"
                        }`}
                >

                    {link.label}
                </ListGroupItem>
            ))}

        </div>

    );
}


{/* <Link href="/Courses/1234/Home" id="wd-course-home-link"
                className="list-group-item active border-0"> Home </Link>
            <Link href="/Courses/1234/Modules" id="wd-course-modules-link"
                className="list-group-item text-danger border-0"> Modules </Link>
            <Link href="/Courses/1234/Piazza" id="wd-course-piazza-link"
                className="list-group-item text-danger border-0"> Piazza </Link>
            <Link href="/Courses/1234/Zoom" id="wd-course-zoom-link"
                className="list-group-item text-danger border-0"> Zoom </Link>
            <Link href="/Courses/1234/Assignments" id="wd-course-assignments-link"
                className="list-group-item text-danger border-0"> Assignments </Link>
            <Link href="/Courses/1234/Quizzes" id="wd-course-quizzes-link"
                className="list-group-item text-danger border-0"> Quizzes </Link>
            <Link href="/Courses/1234/People/Table" id="wd-course-people-link"
                className="list-group-item text-danger border-0" > People </Link> */}

