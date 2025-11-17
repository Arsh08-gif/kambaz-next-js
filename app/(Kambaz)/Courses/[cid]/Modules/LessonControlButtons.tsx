import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../client";
import { setAssignements } from "../Assignments/reducer";
import { deleteAssignment } from "../Assignments/reducer";
import { FaTrash } from "react-icons/fa6";
import { RootState } from "../../../store";

export default function LessonControlButtons({ assignmentId }: { assignmentId: string }) {
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: RootState) => state.assignmentReducer);
    const handleDelete = async (e: React.MouseEvent, assignmentId: string) => {
        console.log("assignment id : " + assignmentId)
        e.stopPropagation();
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this assignment?");
        if (confirmed) {
            // dispatch(deleteAssignment(assignmentId));
            await client.deleteAssignment(assignmentId);
            dispatch(setAssignements(assignments.filter((a: any) => a._id !== assignmentId)));
        }
    };

    return (
        <div className="float-end">
            <GreenCheckmark />
            <IoEllipsisVertical className="fs-4" />
            <FaTrash className="text-danger me-2 mb-1" onClick={(e) => handleDelete(e,assignmentId)} />
        </div>);
}

