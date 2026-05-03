"use client"
import "./style.css";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setAssignements } from "./reducer";
import * as client from "../../client";
import { useEffect, useState } from "react";
import Link from "next/link";



export default function Assignments() {
    const { cid } = useParams();
    const { assignments } = useSelector((state: RootState) => state.assignmentReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const [searchTerm, setSearchTerm] = useState("");
    console.log("cid assignment: " + cid)
    console.log("current");
    const dispatch = useDispatch();
    const isFaculty = currentUser?.role === "FACULTY";

    const fetchAssignements = async () => {
        const assignments = await client.findAssignementForCourse(cid as string);
        console.log("assignments fetched " + assignments);

        dispatch(setAssignements(assignments));
    };
    useEffect(() => {
        fetchAssignements();
    }, []);

    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: any) => {
        const d = new Date(date);
        return `${d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })} at ${d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;
    };


    return (
        <div id="wd-assignments">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="input-group" style={{ maxWidth: "300px" }}>
                    <span className="input-group-text">
                        <IoMdSearch />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for Assignment"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={(e) => e.target.style.boxShadow = 'none'}
                    />
                    {/* {searchTerm && (
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setSearchTerm("")}
                            type="button"
                        >
                            ×
                        </button>
                    )} */}
                </div>

                <div>
                    {isFaculty && (
                        <>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="me-2"
                                id="wd-add-module-btn"
                            >
                                <FaPlus className="me-2 position-relative" style={{ bottom: "1px" }} />
                                Group
                            </Button>

                            <Link href={`/Courses/${cid}/Assignments/new`}>
                                <Button
                                    variant="danger"
                                    size="lg"
                                    id="wd-add-assignment-btn"
                                >
                                    <FaPlus className="me-2 position-relative" style={{ bottom: "1px" }} />
                                    Assignment
                                </Button>
                            </Link>
                        </>
                    )}

                </div>

            </div>

            <ListGroup className="rounded-0 m-5" id="wd-modules">
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        {isFaculty && (<BsGripVertical className="me-2 fs-3" />)} ASSIGNMENTS
                        <div className="float-end">
                            <span className="badge text-bg-secondary"> 40% of Total</span>
                            <BsPlus />
                            <IoEllipsisVertical className="fs-4" />
                        </div>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">

                        {/* {assignments
                            .map((assignment) => (
                                <Link
                                    key={assignment._id}
                                    href={`/Courses/${cid}/Assignments/${assignment._id}`}
                                    passHref
                                    className="text-decoration-none"
                                >
                                    <ListGroupItem
                                        action
                                        className="wd-lesson p-3 ps-1 text-black"
                                    >
                                        {isFaculty && (
                                            <BsGripVertical className="me-2 fs-3" />
                                        )}

                                        <LuNotebookPen className="text-success" /> {assignment.title}
                                        {isFaculty && (
                                            <LessonControlButtons assignmentId={assignment._id as string} />
                                        )}

                                        <p className="p-3 ps-1 me-6">
                                            <span className="text-danger fw-bold">Multiple Modules</span> |
                                            <span className="fw-bold"> Not available until </span> May 6 at 12:00am |
                                            <span className="fw-bold"> Due</span> May 13 at 11:59pm | 100 pts
                                        </p>
                                    </ListGroupItem>
                                </Link>

                            ))
                        } */}

                        {filteredAssignments.length === 0 ? (
                            <ListGroupItem className="text-center text-muted py-4">
                                {searchTerm
                                    ? `No assignments found`
                                    : "No assignments available"
                                }
                            </ListGroupItem>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                // <Link
                                //     key={assignment._id}
                                //     href={`/Courses/${cid}/Assignments/${assignment._id}`}
                                //     passHref
                                //     className="text-decoration-none"
                                // >
                                //     <ListGroupItem
                                //         action
                                //         className="wd-lesson p-3 ps-1 text-black"
                                //     >
                                //         {isFaculty && (
                                //             <BsGripVertical className="me-2 fs-3" />
                                //         )}

                                //         <LuNotebookPen className="text-success" /> {assignment.title}
                                //         {isFaculty && (
                                //             <LessonControlButtons assignmentId={assignment._id as string} />
                                //         )}

                                //         <p className="p-3 ps-1 me-6">
                                //             <span className="text-danger fw-bold">Multiple Modules</span> |
                                //             <span className="fw-bold"> Not available until </span> May 6 at 12:00am |
                                //             <span className="fw-bold"> Due</span> May 13 at 11:59pm | 100 pts
                                //         </p>
                                //     </ListGroupItem>
                                // </Link>

                                <ListGroupItem
                                    key={assignment._id}
                                    action
                                    className="wd-lesson p-3 ps-1 text-black"
                                >
                                    {isFaculty && (
                                        <BsGripVertical className="me-2 fs-3" />
                                    )}

                                    <Link
                                        href={`/Courses/${cid}/Assignments/${assignment._id}`}
                                        className="text-decoration-none text-dark fw-bold"
                                    >
                                        <LuNotebookPen className="text-success" /> {assignment.title}
                                    </Link>

                                    {/* <LuNotebookPen className="text-success" /> {assignment.title} */}
                                    {isFaculty && (
                                        <LessonControlButtons assignmentId={assignment._id as string} />
                                    )}

                                    <p className="p-3 ps-1 me-6">
                                        <span className="text-danger fw-bold">Multiple Modules</span> |
                                        {/* <span className="fw-bold"> Not available until </span> May 6 at 12:00am |
                                        <span className="fw-bold"> Due</span> May 13 at 11:59pm | 100 pts */}
                                        {/* <span className="fw-bold"> Not available until </span> {assignment.until} |
                                        <span className="fw-bold"> Due</span> {assignment.due_date} | {assignment.points} */}

                                        <span className="fw-bold"> Not available until </span>
                                        {new Date(assignment.available_date).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}|
                                        <span className="fw-bold"> Due</span> {new Date(assignment.due_date).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}  | {assignment.points}
                                    </p>
                                </ListGroupItem>
                            ))
                        )}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div >);
}


