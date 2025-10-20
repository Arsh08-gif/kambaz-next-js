import Link from "next/link";
import * as db from "../Database";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap";
//import Image from "next/image";
//import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap";
export default function Dashboard() {
    const courses = db.courses;
    // return (
    //     <div id="wd-dashboard">
    //         <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
    //         <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
    //         <div id="wd-dashboard-courses">
    //             <Row xs={1} md={5} className="g-4">
    //                 <Col className="wd-dashboard-course" style={{ width: "300px" }}>
    //                     <Card>
    //                         <Link href="/Courses/1234/Home"
    //                             className="wd-dashboard-course-link text-decoration-none text-dark">
    //                             <CardImg variant="top" src="/Images/react.png" width="100%" height={160} />
    //                             <CardBody>
    //                                 <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
    //                                 <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
    //                                     Full Stack software developer</CardText>
    //                                 <Button variant="primary">Go</Button>
    //                             </CardBody>
    //                         </Link>
    //                     </Card>
    //                 </Col>
    //                 <Col className="wd-dashboard-course" style={{ width: "300px" }}>
    //                     <Card>
    //                         <Link href="/Courses/1234/Home"
    //                             className="wd-dashboard-course-link text-decoration-none text-dark">
    //                             <CardImg variant="top" src="/Images/html.png" width="100%" height={160} />
    //                             <CardBody>
    //                                 <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1566 HTML</CardTitle>
    //                                 <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
    //                                     Full Stack software developer</CardText>
    //                                 <Button variant="primary">Go</Button>
    //                             </CardBody>
    //                         </Link>
    //                     </Card>
    //                 </Col>
    //                 <Col className="wd-dashboard-course" style={{ width: "300px" }}>
    //                     <Card>
    //                         <Link href="/Courses/1234/Home"
    //                             className="wd-dashboard-course-link text-decoration-none text-dark">
    //                             <CardImg variant="top" src="/Images/css.jpg" height={160} />
    //                             <CardBody>
    //                                 <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1345 CSS</CardTitle>
    //                                 <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
    //                                     Full Stack software developer</CardText>
    //                                 <Button variant="primary">Go</Button>
    //                             </CardBody>
    //                         </Link>
    //                     </Card>
    //                 </Col>
    //                 <Col className="wd-dashboard-course" style={{ width: "300px" }}>
    //                     <Card>
    //                         <Link href="/Courses/1234/Home"
    //                             className="wd-dashboard-course-link text-decoration-none text-dark">
    //                             <CardImg variant="top" src="/Images/nodejs.png" width="100%" height={160} />
    //                             <CardBody>
    //                                 <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1679 Node Js</CardTitle>
    //                                 <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
    //                                     Full Stack software developer</CardText>
    //                                 <Button variant="primary">Go</Button>
    //                             </CardBody>
    //                         </Link>
    //                     </Card>
    //                 </Col>
    //                 <Col className="wd-dashboard-course" style={{ width: "300px" }}>
    //                     <Card>
    //                         <Link href="/Courses/1234/Home"
    //                             className="wd-dashboard-course-link text-decoration-none text-dark">
    //                             <CardImg variant="top" src="/Images/databases.jpg" width="100%" height={160} />
    //                             <CardBody>
    //                                 <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1799 Databases</CardTitle>
    //                                 <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
    //                                     Full Stack software developer</CardText>
    //                                 <Button variant="primary">Go</Button>
    //                             </CardBody>
    //                         </Link>
    //                     </Card>
    //                 </Col>
    //                 <Col className="wd-dashboard-course" style={{ width: "300px" }}>
    //                     <Card>
    //                         <Link href="/Courses/1234/Home"
    //                             className="wd-dashboard-course-link text-decoration-none text-dark">
    //                             <CardImg variant="top" src="/Images/js.png" width="100%" height={160} />
    //                             <CardBody>
    //                                 <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1455 JavaScript</CardTitle>
    //                                 <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
    //                                     Full Stack software developer</CardText>
    //                                 <Button variant="primary">Go</Button>
    //                             </CardBody>
    //                         </Link>
    //                     </Card>
    //                 </Col>
    //                 <Col className="wd-dashboard-course" style={{ width: "300px" }}>
    //                     <Card>
    //                         <Link href="/Courses/1234/Home"
    //                             className="wd-dashboard-course-link text-decoration-none text-dark">
    //                             <CardImg variant="top" src="/Images/mongodb.png" height={170} />
    //                             <CardBody>
    //                                 <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1355 MongoDB</CardTitle>
    //                                 <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
    //                                     Full Stack software developer</CardText>
    //                                 <Button variant="primary">Go</Button>
    //                             </CardBody>
    //                         </Link>
    //                     </Card>
    //                 </Col>
    //             </Row>
    //         </div>
    //     </div>
    // );

    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {courses.map((course) => (
                        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                            <Card>
                                <Link href={`/Courses/${course._id}/Home`}
                                    className="wd-dashboard-course-link text-decoration-none text-dark" >
                                    <CardImg src="/Images/react.png" variant="top" width="100%" height={160} />
                                    <CardBody className="card-body">
                                        <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                            {course.name} </CardTitle>
                                        <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                            {course.description} </CardText>
                                        <Button variant="primary"> Go </Button>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}

