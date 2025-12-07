import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../client";
import { setAssignements } from "../Assignments/reducer";
import { deleteAssignment } from "../Assignments/reducer";
import { FaTrash } from "react-icons/fa6";
import { RootState } from "../../../store";
import { Alert, Button } from "react-bootstrap";
import { useState } from "react";

export default function LessonControlButtons({ assignmentId }: { assignmentId: string }) {
    interface Assignment {
        _id: string;
        title: string;
        course: string;
        description: string;
        points: number;
        available_date: Date;
        due_date: Date;
        until: Date;
    }
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: RootState) => state.assignmentReducer);
    const [deleteAlert, setDeleteAlert] = useState<string | null>(null);

    //e: React.MouseEvent,
    const handleDelete = async ( assignmentId: string) => {
        console.log("assignment id : " + assignmentId)
        // e.stopPropagation();
        // e.preventDefault();
        await client.deleteAssignment(assignmentId);
        dispatch(setAssignements(assignments.filter((a: Assignment) => a._id !== assignmentId)));
        setDeleteAlert(null);
        // const confirmed = window.confirm("Are you sure you want to delete this assignment?");
        // if (confirmed) {
        //     // dispatch(deleteAssignment(assignmentId));
        //     await client.deleteAssignment(assignmentId);
        //     dispatch(setAssignements(assignments.filter((a: Assignment) => a._id !== assignmentId)));
        // }
    };

    return (
        <div className="float-end">
            {deleteAlert && (
                <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                    <span>Are you sure you want to delete this quiz?</span>
                    <div>
                        <Button
                            variant="danger"
                            size="sm"
                            className="me-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleDelete(deleteAlert)}}
                        >
                            Yes, Delete
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setDeleteAlert(null);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Alert>
            )}
            <GreenCheckmark />
            <IoEllipsisVertical className="fs-4" />
            <FaTrash className="text-danger me-2 mb-1"
                // onClick={(e) => handleDelete(e, assignmentId)}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setDeleteAlert(assignmentId);
                }}
            />
        </div>);
}

