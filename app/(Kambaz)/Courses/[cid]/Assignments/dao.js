import { v4 as uuidv4 } from 'uuid';
export default function AssignemtDao(db) {
    function findAssignementForCourse(courseId) {
        const { assignments } = db;
        return assignments.filter((assignement) => assignement.course === courseId);
    }
    function createAssignement(assignement) {
        const newAssignment = { ...assignement, _id: uuidv4() };
        db.assignments = [...db.assignments, newAssignment];
        return newAssignment;
    }
    function updateAssignement(assignementId, assignementUpdates) {
        const { assignments } = db;
        const assignement = assignments.find((assignement) => assignement._id === assignementId);
        Object.assign(assignement, assignementUpdates);
        return assignement;
    }
    function deleteAssignment(assignementId) {
        const { assignments } = db;
        db.assignments = assignments.filter((assignement) => assignement._id !== assignementId);
    }

    return {
        findAssignementForCourse,
        createAssignement,
        updateAssignement,
        deleteAssignment
    };
}