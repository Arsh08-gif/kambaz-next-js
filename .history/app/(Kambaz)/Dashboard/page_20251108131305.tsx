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
import { json } from "stream/consumers";

export default function Dashboard() {
    //const courses = db.courses;
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    console.log("current user on dashboard : " + JSON.stringify(currentUser));
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
    // const updateCourse = () => {
    //     setCourses(
    //         courses.map((c) => {
    //             if (c._id === course._id) {
    //                 return course;
    //             } else {
    //                 return c;
    //             }
    //         })
    //     );
    // };
    // const addNewCourse = () => {
    //     const newCourse = { ...course, _id: uuidv4() };
    //     setCourses([...courses, newCourse]);
    // };
    // const deleteCourse = (courseId: string) => {
    //     setCourses(courses.filter((course) => course._id !== courseId));
    // };

    //const isFaculty = currentUser?.role === "FACULTY";
    // const isFaculty = false;

    // const isEnrolled = (courseId: string) => {
    //     if (!currentUser) return false;
    //     return enrollments.some(
    //         (enrollment) =>
    //             //enrollment.user === currentUser._id &&
    //             enrollment.course === courseId
    //     );
    // };

    // const handleEnroll = (courseId: string, event: React.MouseEvent) => {
    //     event.preventDefault();
    //     if (currentUser) {
    //         dispatch(enrollInCourse({ userId: "123", courseId }));
    //     }
    // };

    // const handleUnenroll = (courseId: string, event: React.MouseEvent) => {
    //     event.preventDefault();
    //     if (currentUser) {
    //         dispatch(unenrollFromCourse({ userId: "123", courseId }));
    //     }
    // };

    // const displayedCourses = showAllCourses
    //     ? courses
    //     : courses.filter((course) => isEnrolled(course._id));


    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            {/* {!isFaculty && (
                <Button
                    variant="primary"
                    onClick={() => setShowAllCourses(!showAllCourses)}
                    id="wd-enrollments-toggle"
                >
                    {showAllCourses ? "Show My Courses" : "All Courses"}
                </Button>
            )} */}
            {/* {isFaculty && (
                <>
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
                </>
            )} */}

            {/* <Button
                variant="primary"
                onClick={() => setShowAllCourses(!showAllCourses)}
                id="wd-enrollments-toggle"
            >
                {showAllCourses ? "Show My Courses" : "All Courses"}
            </Button> */}

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
                        .filter((course) =>
                            enrollments.some(
                                (enrollment) =>
                                    enrollment.user === currentUser?._id &&
                                    enrollment.course === course._id
                            ))
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
                                            <Button variant="primary"> Go </Button>
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
                                        </CardBody>
                                    </Link>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>
            {/* {showAllCourses ? "All Courses" : "Published Courses"} ({displayedCourses.length})<hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {courses
                        .filter((course) =>
                            enrollments.some(
                                (enrollment) =>
                                    //enrollment.user === currentUser?._id &&
                                    enrollment.course === course._id
                            ))
                        .map((course) => (
                            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                                <Card>
                                    <Link href={`/Courses/${course._id}/Home`}
                                        className="wd-dashboard-course-link text-decoration-none text-dark" >
                                        <CardImg src={course.image} variant="top" width="100%" height={160} />
                                        <CardBody className="card-body">
                                            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                {course.name} </CardTitle>
                                            <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                                {course.description} </CardText>
                                            <Button variant="primary"> Go </Button>
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
                                        </CardBody>
                                    </Link>
                                </Card>
                            </Col>
                        ))
                    }

                    {displayedCourses.map((course) => {
                        const enrolled = isEnrolled(course._id);

                        return (
                            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                                <Card>
                                    <Link
                                        href={enrolled ? `/Courses/${course._id}/Home` : "#"}
                                        className="wd-dashboard-course-link text-decoration-none text-dark"
                                        onClick={(e) => {
                                            if (!enrolled) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <CardImg src={course.image} variant="top" width="100%" height={160} />
                                        <CardBody className="card-body">
                                            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                {course.name}
                                            </CardTitle>
                                            <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                                {course.description}
                                            </CardText>

                                            {enrolled && (
                                                <Button variant="primary"> Go </Button>
                                            )}

                                            {isFaculty ? (
                                                <>
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
                                                        className="btn btn-warning me-2 float-end">
                                                        Edit
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {enrolled ? (
                                                        <button
                                                            onClick={(event) => handleUnenroll(course._id, event)}
                                                            className="btn btn-danger float-end"
                                                            id={`wd-unenroll-course-${course._id}`}>
                                                            Unenroll
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(event) => handleEnroll(course._id, event)}
                                                            className="btn btn-success float-end"
                                                            id={`wd-enroll-course-${course._id}`}>
                                                            Enroll
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </CardBody>
                                    </Link>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div> */}
        </div>
    );
}

