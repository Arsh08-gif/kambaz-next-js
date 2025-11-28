"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";
import { RootState } from "../store";
import Link from "next/link";
import * as client from "../Courses/client";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
//import { enrollInCourse, unenrollFromCourse } from "./reducer";
import { enrollCourse, unenrollCourse, addEnrollment, setEnrollments } from "../Account/reducer"
import { json } from "stream/consumers";

export default function Dashboard() {
    // interface Course {
    //     _id: string;
    //     name: string;
    //     number: string;
    //     image: string;
    //     startDate: string;
    //     endDate: string;
    //     department: string;
    //     credits: number;
    //     description: string;
    //     color?: string;
    // }
    //const courses = db.courses;
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const { enrollments } = useSelector((state: RootState) => state.accountReducer);
    console.log("current user on dashboard : " + JSON.stringify(currentUser));
    // if (!currentUser) {
    //     return <div>Please log in to view your courses.</div>;
    // }

    //const { enrollments } = db;
    const dispatch = useDispatch();

    const [showAllCourses, setShowAllCourses] = useState(false);
    // const [course, setCourse] = useState<Course>({
    //     _id: "0",
    //     name: "New Course",
    //     number: "New Number",
    //     startDate: "2023-09-10",
    //     endDate: "2023-12-15",
    //     description: "New Description",
    //     image: "",
    //     department: "",
    //     credits: 0
    // });
    const [course, setCourse] = useState<any>({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        description: "New Description",
        image: "",
        department: "",
        credits: 0
    });

    const onAddNewCourse = async () => {
        // const newCourse = await client.createCourse(course);
        // dispatch(setCourses([...courses, newCourse]));
        const response = await client.createCourse(course);
        console.log("create course response " + JSON.stringify(response));
        dispatch(setCourses([...courses, response.course]));
        dispatch(addEnrollment(response.enrollment))
    };

    const fetchCourses = async () => {
        try {
            if (showAllCourses) {
                console.log("all courses " + showAllCourses);
                const allCourses = await client.fetchAllCourses();
                console.log("all courses " + JSON.stringify(allCourses));
                dispatch(setCourses(allCourses));

                // if (currentUser) {
                //     const userEnrollments = await client.getUserEnrollments(currentUser._id);
                //     console.log("enrollements " + JSON.stringify(userEnrollments));

                //     dispatch(setEnrollments(userEnrollments));
                // }
            }
            else {
                if (!currentUser) {
                    dispatch(setCourses([]));
                    dispatch(setEnrollments([]));
                    return;
                }
                const userCourses = await client.findCoursesForEnrolledUser(currentUser._id);
                const userEnrollments = await client.getUserEnrollments(currentUser._id);
                console.log("userCourses " + JSON.stringify(userCourses));
                console.log("userEnrollments " + JSON.stringify(userEnrollments));

                dispatch(setEnrollments(userEnrollments));
                // const courseIds = userEnrollments.map((e: any) => e.course);
                // console.log("enrollement courses ids " + courseIds);
                // const myCourses = await client.fetchCoursesByIds(courseIds);
                // console.log("enrolled courses " + myCourses); 
                // dispatch(setCourses(myCourses));
                dispatch(setCourses(userCourses));
                //const courses = await client.findMyCourses();
                //dispatch(setCourses(courses));
            }

            // if (currentUser) {
            //     const userEnrollments = await client.getUserEnrollments(currentUser._id);
            //     console.log("enrollements " + JSON.stringify(userEnrollments));

            //     dispatch(setEnrollments(userEnrollments));
            // } 
            // else {
            //     dispatch(setEnrollments([]));
            // }
        } catch (error) {
            console.error("fetch error " + error);
        }
    };
    const onUpdateCourse = async () => {
        console.log("inside update");
        console.log("course " + JSON.stringify(course));
        await client.updateCourse(course);
        dispatch(setCourses(courses.map((c) => {
            if (c._id === course._id) { return course; }
            else { return c; }
        })));
    };

    useEffect(() => {
        fetchCourses();
    }, [currentUser, showAllCourses]);

    const isEnrolled = (courseId: string) => {
        //console.log("inside IsEnrolled ");
        //console.log("current user isEnrolled " + currentUser);
        //console.log("course id isEnrolled " + courseId);

        if (!currentUser) return false;
        return enrollments.some(
            (enrollment) => enrollment.user === currentUser._id
                && enrollment.course === courseId
        );
    };

    const onEnroll = async (courseId: string) => {
        console.log("inside onEnroll");

        if (!currentUser) {
            alert("Please sign in to enroll in courses");
            return;
        }
        //const response = await client.enrollCourse(currentUser._id, courseId);
        const response = await client.enrollIntoCourse(currentUser._id, courseId);
        console.log("Enrollment course :", JSON.stringify(response));
        dispatch(addEnrollment(response))
        console.log("isEnrolled " + isEnrolled(courseId));

    }
    // const handleEnroll = (courseId: string) => {
    //     if (!currentUser) {
    //         alert("Please sign in to enroll in courses");
    //         return;
    //     }
    //     dispatch(enrollCourse({ userId: currentUser._id, courseId }));
    //     console.log("isEnrolled : " + isEnrolled);

    // };

    // const handleUnenroll = (courseId: string) => {
    //     if (!currentUser) {
    //         alert("Please sign in to unenroll in courses");
    //         return;
    //     }
    //     dispatch(unenrollCourse({ userId: currentUser._id, courseId }));
    // }

    const onUnEnroll = async (courseId: string) => {
        console.log("inside unEnroll");
        if (!currentUser) {
            alert("Please sign in to unenroll in courses");
            return;
        }
        // const response = await client.unEnrollCourse(currentUser._id, courseId);
        const response = await client.unenrollFromCourse(currentUser._id, courseId);
        console.log("Unenrollment response:", JSON.stringify(response));
        if (response.acknowledge === "true") {
            const userEnrollments = await client.getUserEnrollments(currentUser._id);
            console.log("userEnrollments after unenroll " + JSON.stringify(userEnrollments));
            dispatch(setEnrollments(userEnrollments));
        }
        // dispatch(addEnrollment(response))
    }

    const onDeleteCourse = async (courseId: string) => {
        console.log("insdie deleteCourse");
        const status = await client.deleteCourse(courseId);
        dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
    };


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
                    onClick={onAddNewCourse} > Add
                </button>
                <button className="btn btn-warning float-end me-2"
                    onClick={onUpdateCourse} id="wd-update-course-click">
                    Update
                </button>
            </h5>
            <br />
            <FormControl value={course.name} className="mb-2"
                onChange={(e) => setCourse({ ...course, name: e.target.value })} />
            <FormControl value={course.description} aria-rowspan={3}
                onChange={(e) => setCourse({ ...course, description: e.target.value })} />

            <hr />

            <h2 id="wd-dashboard-published">Published Courses ({courses?.length || 0})</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {courses?.map((course) => (
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
                                        <div className="d-flex gap-1 mt-2 justify-content-end align-items-center" style={{ marginRight: "-22px" }}>
                                            <Button variant="primary"> Go </Button>
                                            {isEnrolled(course._id) ? (
                                                <button
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        //handleUnenroll(course._id);
                                                        onUnEnroll(course._id)
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
                                                        //handleEnroll(course._id);
                                                        onEnroll(course._id)
                                                    }}
                                                    className="btn btn-success float-end"
                                                    id="wd-enroll-course"
                                                >
                                                    Enroll
                                                </button>
                                            )}
                                            <button onClick={(event) => {
                                                event.preventDefault();
                                                onDeleteCourse(course._id);
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

