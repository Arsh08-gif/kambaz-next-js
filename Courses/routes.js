console.log("inside course router");

import CoursesDao from "./dao.js";
import EnrollmentsDao from "../app/(Kambaz)/Enrollments/dao.js";
export default function CourseRoutes(app, db) {
    const dao = CoursesDao(db);
    const enrollmentsDao = EnrollmentsDao(db);
    const findAllCourses = (req, res) => {
        const courses = dao.findAllCourses();
        res.send(courses);
    }
    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        console.log("Route hit! userId:", req.params.userId);
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            console.log("find courses for enrolled user " + currentUser);

            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = dao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };
    const enrollUser = (req, res) => {
        let { userId, courseId } = req.params;
        const status = enrollmentsDao.enrollUserInCourse(userId, courseId);
        console.log("enrol status " + status);
        res.json(status)
    };
    const unenrollUser = (req, res) => {
        let { userId, courseId } = req.params;
        const userEnrollments = enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        console.log("unenrol status " + userEnrollments);
        res.json(userEnrollments);
    };
    const getUserEnrollments = (req, res) => {
        const { userId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsForUser(userId);
        console.log("user enrollements " + enrollments);
        
        res.json(enrollments);
    };
    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = dao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };
    const deleteCourse = (req, res) => {
        const { courseId } = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status);
    }
    const updateCourse = (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    }

    app.get("/api/users/:userId/enrollments",getUserEnrollments);
    app.delete("/api/courses/:userId/:courseId/enrollments", unenrollUser);
    app.post("/api/courses/:userId/:courseId/enrollments", enrollUser);
    app.put("/api/courses/:courseId", updateCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.get("/api/courses", findAllCourses);
    app.post("/api/users/current/courses", createCourse);
}

