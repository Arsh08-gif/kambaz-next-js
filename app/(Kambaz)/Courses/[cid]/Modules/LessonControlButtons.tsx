import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { useDispatch } from "react-redux";
import { deleteAssignment } from "../Assignments/reducer";
import { FaTrash } from "react-icons/fa6";

export default function LessonControlButtons({ assignmentId }: { assignmentId: string }) {
    const dispatch = useDispatch();
    const handleDelete = (e: React.MouseEvent) => {
        console.log("assignment id : " + assignmentId)
        e.stopPropagation();
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this assignment?");
        if (confirmed) {
            dispatch(deleteAssignment(assignmentId));
        }
    };
    return (
        <div className="float-end">
            <GreenCheckmark />
            <IoEllipsisVertical className="fs-4" />
            <FaTrash className="text-danger me-2 mb-1" onClick={handleDelete}/>
        </div>);
}

