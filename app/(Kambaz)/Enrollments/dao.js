import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
    const { enrollments } = db;
    function enrollUserInCourse(userId, courseId) {
        const enrollment = { _id: uuidv4(), user: userId, course: courseId };
        enrollments.push(enrollment);
        return enrollment;
        //enrollments.push({ _id: uuidv4(), user: userId, course: courseId });

    }
    function unenrollUserFromCourse(userId, courseId) {
        db.enrollments = db.enrollments.filter(
            (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
        );
        return db.enrollments.filter((e) => e.user === userId);
    }
    function findEnrollmentsForUser(userId){
        return enrollments.filter((e) => e.user === userId);
    };

    return { enrollUserInCourse, unenrollUserFromCourse, findEnrollmentsForUser};
}

