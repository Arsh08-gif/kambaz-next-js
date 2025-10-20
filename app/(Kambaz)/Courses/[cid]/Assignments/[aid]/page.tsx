"use client"
import {Col,FormCheck, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import { IoCalendarOutline } from "react-icons/io5";
import { useParams } from "next/navigation";
import * as db from "../../../../Database";
import Link from "next/link";


export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    console.log("aid assignment editor : " + aid)
    console.log("cid assignment editor : " + cid)
    const assignment = db.assignments.find((a) => a._id === aid);
    return (
        <div id="wd-assignments-editor">
            <FormLabel>Assignment Name</FormLabel>
            <FormControl type="text" defaultValue={assignment?.title} />
            <FormControl as="textarea" className="mt-3" rows={3} defaultValue={assignment?.description} />

            <Row className="mb-3 mt-3" controlId="points">
                <FormLabel column className="text-end"> Points </FormLabel>
                <Col sm={10}>
                    <FormControl type="text" defaultValue={assignment?.points} />
                </Col>
            </Row>

            <Row className="mb-3 mt-3" controlId="points">
                <FormLabel column className="text-end"> Assignment Group </FormLabel>
                <Col sm={10}>
                    <FormSelect>
                        <option value="0" defaultChecked>ASSIGNMENTS</option>
                    </FormSelect>
                </Col>
            </Row>

            <Row className="mb-3 mt-3" controlId="points">
                <FormLabel column className="text-end"> Display Grade as </FormLabel>
                <Col sm={10}>
                    <FormSelect>
                        <option value="0" defaultChecked>Percentage</option>
                    </FormSelect>
                </Col>
            </Row>

            <Row className="mb-3 mt-3" controlId="submission">
                <FormLabel column className="text-end"> Submission Type </FormLabel>
                <Col sm={10} className="submission-box">
                    <div className="border rounded p-3 mt-2">
                        <FormSelect defaultValue={"Online"}>
                            <option value="0" defaultChecked>Online</option>
                        </FormSelect>
                        <div className="border rounded p-3 mt-2">
                            <strong>Online Entry Options</strong>
                            <FormCheck
                                type="checkbox"
                                id="text-entry"
                                label="Text Entry"
                                className="mt-4"
                            >
                            </FormCheck>

                            <FormCheck
                                type="checkbox"
                                id="text-entry"
                                label="Website URL"
                                defaultChecked
                                className="mt-4"
                            >
                            </FormCheck>

                            <FormCheck
                                type="checkbox"
                                id="text-entry"
                                label="Media Recordings"
                                className="mt-4"
                            >
                            </FormCheck>

                            <FormCheck
                                type="checkbox"
                                id="text-entry"
                                label="Student Annotation"
                                className="mt-4"
                            >
                            </FormCheck>

                            <FormCheck
                                type="checkbox"
                                id="text-entry"
                                label="File Uploads"
                                className="mt-4"
                            >
                            </FormCheck>
                        </div>
                    </div>
                </Col>
            </Row>


            <Row className="mb-3 mt-3" controlId="assign">
                <FormLabel column className="text-end"> Assign </FormLabel>
                <Col sm={10}>
                    <div className="border rounded p-3 mt-2">
                        <strong>Assign To</strong>
                        <div className="input-group">
                            <span className="input-group-text">First and last name</span>
                            <input type="text" aria-label="First name" className="form-control" />
                            <input type="text" aria-label="Last name" className="form-control" />
                        </div>

                        <div className="input-group mt-3">
                            <strong>Due</strong>
                            <div className="input-group">
                                <input type="text" className="form-control" defaultValue={assignment?.due_date}/>
                                <span className="input-group-text"><IoCalendarOutline /></span>
                            </div>
                        </div>

                        <div className="mt-3">
                            <Row>
                                <Col>
                                    <strong>Available From</strong>
                                    <div className="input-group">
                                        <input type="text" className="form-control" defaultValue={assignment?.available_date} />
                                        <span className="input-group-text"><IoCalendarOutline /></span>
                                    </div>
                                </Col>
                                <Col>
                                    <strong>Until</strong>
                                    <div className="input-group">
                                        <input type="text" className="form-control" defaultValue={assignment?.until} />
                                        <span className="input-group-text"><IoCalendarOutline /></span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>


                </Col>
            </Row>
            <hr />
            <div>
                <Link href={`/Courses/${cid}/Assignments`} className="btn btn-danger btn-lg me-1 float-end m-10" id="wd-cancel-btn">
                    Cancel
                </Link>
                <Link href={`/Courses/${cid}/Assignments`} className="btn btn-secondary btn-lg me-1 float-end m-10" id="wd-save-btn">
                    Save
                </Link>
            </div>

        </div>


    );
}

