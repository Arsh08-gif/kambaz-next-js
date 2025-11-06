"use client"
import "./style.css";
import { Button,ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { assignments } from "../../../Database";
import { useParams } from "next/navigation";

export default function Assignments() {
    const { cid } = useParams();
    console.log("cid assignment: " + cid)
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
                        placeholder="Search for Quiz"
                    />
                </div>

                <div>

                    <Button
                        variant="danger"
                        size="lg"
                        href={`/Courses/${cid}/Assignments/new`}
                        id="wd-add-assignment-btn"
                    >
                        <FaPlus className="me-2 position-relative" style={{ bottom: "1px" }} />
                        Quiz
                    </Button>
                </div>

            </div>

            <ListGroup className="rounded-0 m-5" id="wd-modules">
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> Assignement Quizzes
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {/* {assignments
                            .filter((assignment) => assignment.course === cid)
                            .map((assignment) => (
                                <ListGroupItem key={assignment._id} action href={`/Courses/${cid}/Assignments/${assignment._id}`} className="wd-lesson p-3 ps-1 text-black">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <LuNotebookPen className="text-success" /> {assignment.title}
                                    <LessonControlButtons assignmentId=""/>
                                    <p className="p-3 ps-1 me-6">
                                        <span className="text-danger fw-bold">Closed</span> |
                                        <span className="fw-bold"> Not available until </span> May 6 at 12:00am |
                                        <span className="fw-bold"> Due</span> May 13 at 11:59pm | 100 pts | 11 Questions
                                    </p>

                                </ListGroupItem>
                            ))
                        } */}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div >
    );
}

