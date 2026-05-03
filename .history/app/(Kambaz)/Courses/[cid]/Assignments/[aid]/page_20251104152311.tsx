"use client"
import { Button, Col, FormCheck, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import { IoCalendarOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";
import * as db from "../../../../Database";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";


export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    console.log("aid assignment editor : " + aid)
    console.log("cid assignment editor : " + cid)
    const dispatch = useDispatch();
    const existingAssignment = db.assignments.find((a) => a._id === aid);
    console.log("existing assign : " + JSON.stringify(existingAssignment));
    
    //const assignment = db.assignments.find((a) => a._id === aid);
    const [assignment, setAssignment] = useState({
        _id: existingAssignment?._id || "",
        title: existingAssignment?.title || "",
        description: existingAssignment?.description || "",
        points: existingAssignment?.points || 0,
        course: cid,
        available_date: existingAssignment?.available_date || "",
        due_date: existingAssignment?.due_date || "",
        until: existingAssignment?.until || "",
    });
    console.log("assingment : " + JSON.stringify(assignment));
    
    // const [assignment, setAssignment] = useState({
    //     _id: aid|| "",
    //     title: aid || "",
    //     description:  "",
    //     points: 0,
    //     course: cid,
    //     available_date:  "",
    //     due_date:  "",
    //     until:  "",
    // });

    useEffect(() => {
        if (existingAssignment) setAssignment(existingAssignment);
    }, [existingAssignment]);

    const handleChange = (field: string, value: string) => {
        setAssignment({ ...assignment, [field]: value });
    };
    const handleSave = () => {
        //if editing existing assignment, could use updateAssignment
        //dispatch(addAssignment(assignment));
        if (existingAssignment) {
            dispatch(updateAssignment(assignment)); 
        } else {
            dispatch(addAssignment(assignment)); 
        }
        console.log("adding..");
        
        //dispatch(addAssignment(assignment)); 
        //redirect(`/Courses/${cid}/Assignments`);
    };
    const handleCancel = () => {
        console.log("canceling ... "); 
         redirect(`/Courses/${cid}/Assignments`);
    };
    return (
        <div id="wd-assignments-editor">
            <FormLabel>Assignment Name</FormLabel>
            <FormControl type="text"
                defaultValue={assignment?.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />
            <FormControl as="textarea"
                className="mt-3"
                rows={3}
                defaultValue={assignment?.description}
                onChange={(e) => handleChange("description", e.target.value)}
            />

            <Row className="mb-3 mt-3" controlId="points">
                <FormLabel column className="text-end"> Points </FormLabel>
                <Col sm={10}>
                    <FormControl type="text"
                        defaultValue={assignment?.points}
                        onChange={(e) => handleChange("points", e.target.value)}
                    />
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
                                {/* <input type="text" className="form-control" defaultValue={assignment?.due_date} />
                                <span className="input-group-text"><IoCalendarOutline /></span> */}
                                <FormControl
                                    type="text"
                                    value={assignment.due_date}
                                    onChange={(e) => handleChange("due_date", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <Row>
                                <Col>
                                    <strong>Available From</strong>
                                    <div className="input-group">
                                        {/* <input type="text" className="form-control" defaultValue={assignment?.available_date} />
                                        <span className="input-group-text"><IoCalendarOutline /></span> */}
                                        <FormControl
                                            type="text"
                                            value={assignment.available_date}
                                            onChange={(e) => handleChange("available_date", e.target.value)}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <strong>Until</strong>
                                    <div className="input-group">
                                        {/* <input type="text" className="form-control" defaultValue={assignment?.until} />
                                        <span className="input-group-text"><IoCalendarOutline /></span> */}
                                        <FormControl
                                            type="text"
                                            value={assignment.until}
                                            onChange={(e) => handleChange("until", e.target.value)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
            <hr />
            <div>
                {/* <Link href={`/Courses/${cid}/Assignments`}
                    className="btn btn-danger btn-lg me-1 float-end m-10"
                    id="wd-cancel-btn"
                    onClick={handleCancel}
                >
                    Cancel
                </Link> */}
                <Button
                    className="btn btn-danger btn-lg me-1 float-end m-10"
                    id="wd-cancel-btn"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                {/* <Link 
                    href={`/Courses/${cid}/Assignments`}
                    className="btn btn-secondary btn-lg me-1 float-end m-10"
                    id="wd-save-btn"
                    onClick={handleSave}>
                    Save
                </Link> */}
                <Button 
                    className="btn btn-secondary btn-lg me-1 float-end m-10"
                    id="wd-save-btn"
                    onClick={handleSave}>
                    Save
                </Button>
            </div>

        </div>
    );
}

