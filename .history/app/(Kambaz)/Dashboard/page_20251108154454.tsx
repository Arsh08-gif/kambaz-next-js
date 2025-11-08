"use client"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { RootState } from "../store";
import Link from "next/link";
import * as db from "../Database";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { enrollInCourse, unenrollFromCourse } from "./reducer";
import {enrollCourse} from "../Account/reducer"
import { json } from "stream/consumers";

export default function Dashboard() {
    //const courses = db.courses;
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    console.log("current user on dashboard : " + JSON.stringify(currentUser));
    // if (!currentUser) {
    //     return <div>Please log in to view your courses.</div>;
    // }

    const { enrollments } = db;
    const dispatch = useDispatch();

    const [showAllCourses, setShowAllCourses] = useState(false);
    // const [courses, setCourses] = useState<any[]>(db.courses);
    const [course, setCourse] = useState<any>({
        _id: "0", name: "New Course", number: "New Number",
        startDate: "2023-09-10", endDate: "2023-12-15",
        // image: "../../Images/react.png", 
        description: "New Description"
    });

    const isEnrolled = (courseId: string) => {
        if (!currentUser) return false;
        return enrollments.some(
            (enrollment) => enrollment.user === currentUser._id && enrollment.course === courseId
        );
    };

    const handleEnroll = (courseId: string) => {
        if (!currentUser) {
            alert("Please sign in to enroll in courses");
            return;
        }
        dispatch(enrollCourse({ userId: currentUser._id, courseId }));
        
    };

    const handleUnenroll = (courseId: string) => {
        if (!currentUser) return;
        //dispatch(unenrollCourse({ userId: currentUser._id, courseId }));
    }

    // const displayedCourses = showAllCourses
    //     ? courses
    //     : courses.filter((course) => isEnrolled(course._id));


    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />

            <Button
                variant="primary"
                onClick={() => setShowAllCourses(!showAllCourses)}
                id="wd-enrollments-toggle"
                className="mb-2"
            >
                {showAllCourses ? "Show My Courses" : "All Courses"}
            </Button>

            <h5>New Course
                <button className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={() => dispatch(addNewCourse(course))} > Add
                </button>
                <button className="btn btn-warning float-end me-2"
                    onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
                    Update
                </button>
            </h5>
            <br />
            <FormControl value={course.name} className="mb-2"
                onChange={(e) => setCourse({ ...course, name: e.target.value })} />
            <FormControl value={course.description} aria-rowspan={3}
                onChange={(e) => setCourse({ ...course, description: e.target.value })} />

            <hr />

            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {courses
                        // .filter((course) =>
                        //     !currentUser || enrollments.some(
                        //         (enrollment) =>
                        //             enrollment.user === currentUser._id &&
                        //             enrollment.course === course._id
                        //     ))
                        .filter((course) => {
                            if (showAllCourses) {
                                console.log("showAllCourses" + showAllCourses);
                                return true;
                            }
                            if (!currentUser) return false;

                            const userHasEnrollments = enrollments.some(
                                (enrollment) => enrollment.user === currentUser._id
                            );

                            if (!userHasEnrollments) {
                                return course._id === "RS101";
                            }

                            return enrollments.some(
                                (enrollment) =>
                                    enrollment.user === currentUser._id &&
                                    enrollment.course === course._id
                            );
                        })
                        .map((course) => (
                            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                                <Card>
                                    <Link href={`/Courses/${course._id}/Home`}
                                        className="wd-dashboard-course-link text-decoration-none text-dark" >
                                        {course.image ? (<CardImg src={course.image} variant="top" width="100%" height={160} />) : (
                                            <div
                                                style={{
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    width: "100%",
                                                    height: "160px"
                                                }}
                                            />
                                        )}
                                        {/* <CardImg src={course.image} variant="top" width="100%" height={160} /> */}
                                        <CardBody className="card-body">
                                            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                {course.name} </CardTitle>
                                            <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                                {course.description} </CardText>
                                            <div className="d-flex gap-1 mt-2 justify-content-end align-items-center" style={{marginRight: "-22px"}}>
                                                <Button variant="primary"> Go </Button>
                                                {isEnrolled(course._id) ? (
                                                    <button
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleUnenroll(course._id);
                                                        }}
                                                        className="btn btn-danger float-end"
                                                        id="wd-unenroll-course"
                                                    >
                                                        Unenroll
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleEnroll(course._id);
                                                        }}
                                                        className="btn btn-success float-end"
                                                        id="wd-enroll-course"
                                                    >
                                                        Enroll
                                                    </button>
                                                )}
                                                <button onClick={(event) => {
                                                    event.preventDefault();
                                                    dispatch(deleteCourse(course._id));
                                                }} className="btn btn-danger float-end"
                                                    id="wd-delete-course-click">
                                                    Delete
                                                </button>
                                                <button id="wd-edit-course-click"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setCourse(course);
                                                    }}
                                                    className="btn btn-warning me-2 float-end" >
                                                    Edit
                                                </button>
                                            </div>
                                        </CardBody>
                                    </Link>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>
        </div>
    );
}

