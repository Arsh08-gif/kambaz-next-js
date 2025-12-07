"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { Button, Container, Form, Row, Col, Nav } from "react-bootstrap";
//import dynamic from "next/dynamic";
import * as client from "../../../../client";

// Dynamic import for rich text editor (if using react-quill or similar)
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const [activeTab, setActiveTab] = useState("details");

    const [quiz, setQuiz] = useState({
        _id: "",
        courseId: cid as string,
        title: "Unnamed Quiz",
        description: "",
        quizType: "Graded Quiz",
        points: 0,
        assignmentGroup: "QUIZZES",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        numberOfAttempts: 1,
        showCorrectAnswers: "immediately",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: "",
        availableDate: "",
        availableUntilDate: "",
        numberOfQuestions: 0,
        published: false
    });

    useEffect(() => {
        if (qid && qid !== "new") {
            fetchQuiz();
        }
    }, [qid]);

    const fetchQuiz = async () => {
        try {
            const fetchedQuiz = await client.findQuizById(qid as string);
            setQuiz({
                ...fetchedQuiz,
                dueDate: formatDateForInput(fetchedQuiz.dueDate),
                availableDate: formatDateForInput(fetchedQuiz.availableDate),
                availableUntilDate: formatDateForInput(fetchedQuiz.availableUntilDate)
            });
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
    };

    const formatDateForInput = (date: string | Date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSave = async () => {
        try {
            if (qid === "new") {
                const newQuiz = await client.createQuiz(cid as string, quiz);
                router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}`);
            } else {
                await client.updateQuiz(quiz);
                router.push(`/Courses/${cid}/Quizzes/${qid}`);
            }
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Error saving quiz");
        }
    };

    const handleSaveAndPublish = async () => {
        try {
            const updatedQuiz = { ...quiz, published: true };
            if (qid === "new") {
                await client.createQuiz(cid as string, updatedQuiz);
            } else {
                await client.updateQuiz(updatedQuiz);
            }
            router.push(`/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error("Error saving and publishing quiz:", error);
            alert("Error saving and publishing quiz");
        }
    };

    const handleCancel = () => {
        router.push(`/Courses/${cid}/Quizzes`);
    };

    const handleQuestionsTab = () => {
        if (qid === "new") {
            alert("Please save the quiz first before adding questions");
            return;
        }
        router.push(`/Courses/${cid}/Quizzes/${qid}/questions`);
    };

    return (
        <Container className="mt-4">
            <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === "details"}
                        onClick={() => setActiveTab("details")}
                    >
                        Details
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === "questions"}
                        onClick={handleQuestionsTab}
                    >
                        Questions
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Details Tab Content */}
            {activeTab === "details" && (
                <Form>
                    {/* Title */}
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Unnamed Quiz"
                            value={quiz.title}
                            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                            style={{ fontSize: "1.5rem", fontWeight: "bold", border: "none", borderBottom: "1px solid #ccc" }}
                        />
                    </Form.Group>

                    {/* Quiz Instructions */}
                    {/* <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Quiz Instructions:</Form.Label>
                        <ReactQuill
                            theme="snow"
                            value={quiz.description}
                            onChange={(value) => setQuiz({ ...quiz, description: value })}
                            style={{ height: "200px", marginBottom: "50px" }}
                        />
                    </Form.Group> */}
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Quiz Instructions:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            value={quiz.description}
                            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                            placeholder="Enter quiz instructions..."
                            style={{ minHeight: "150px" }}
                        />
                    </Form.Group>

                    {/* Quiz Type */}
                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Label className="fw-bold">Quiz Type</Form.Label>
                        </Col>
                        <Col md={9}>
                            <Form.Select
                                value={quiz.quizType}
                                onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
                            >
                                <option value="Graded Quiz">Graded Quiz</option>
                                <option value="Practice Quiz">Practice Quiz</option>
                                <option value="Graded Survey">Graded Survey</option>
                                <option value="Ungraded Survey">Ungraded Survey</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Label>Points</Form.Label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="number"
                                value={quiz.points}
                                onChange={(e) => setQuiz({ ...quiz, points: parseInt(e.target.value) })}
                            />
                        </Col>
                    </Row>

                    {/* Assignment Group */}
                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Label className="fw-bold">Assignment Group</Form.Label>
                        </Col>
                        <Col md={9}>
                            <Form.Select
                                value={quiz.assignmentGroup}
                                onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                            >
                                <option value="QUIZZES">Quizzes</option>
                                <option value="EXAMS">Exams</option>
                                <option value="ASSIGNMENTS">Assignments</option>
                                <option value="PROJECT">Project</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* Options Section */}
                    <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3">Options</h5>

                        {/* Shuffle Answers */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Shuffle Answers"
                                checked={quiz.shuffleAnswers}
                                onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                            />
                        </Form.Group>

                        {/* Time Limit */}
                        <Row className="mb-3 align-items-center">
                            <Col md={3}>
                                <Form.Check
                                    type="checkbox"
                                    label="Time Limit"
                                    checked={quiz.timeLimit > 0}
                                    onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.checked ? 20 : 0 })}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    value={quiz.timeLimit}
                                    onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })}
                                    disabled={quiz.timeLimit === 0}
                                />
                            </Col>
                            <Col md={2}>
                                <span>Minutes</span>
                            </Col>
                        </Row>

                        {/* Multiple Attempts */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Allow Multiple Attempts"
                                checked={quiz.multipleAttempts}
                                onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
                            />
                        </Form.Group>

                        {/* Number of Attempts */}
                        {quiz.multipleAttempts && (
                            <Row className="mb-3 align-items-center">
                                <Col md={3}>
                                    <Form.Label>Number of Attempts</Form.Label>
                                </Col>
                                <Col md={3}>
                                    <Form.Control
                                        type="number"
                                        value={quiz.numberOfAttempts}
                                        onChange={(e) => setQuiz({ ...quiz, numberOfAttempts: parseInt(e.target.value) || 1 })}
                                        min="1"
                                    />
                                </Col>
                            </Row>
                        )}

                        {/* Show Correct Answers */}
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label className="fw-bold">Show Correct Answers</Form.Label>
                            </Col>
                            <Col md={9}>
                                <Form.Select
                                    value={quiz.showCorrectAnswers}
                                    onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}
                                >
                                    <option value="immediately">Immediately</option>
                                    <option value="after_last_attempt">After Last Attempt</option>
                                    <option value="after_due_date">After Due Date</option>
                                    <option value="never">Never</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* Access Code */}
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Access Code</Form.Label>
                            </Col>
                            <Col md={9}>
                                <Form.Control
                                    type="text"
                                    placeholder="Optional access code"
                                    value={quiz.accessCode}
                                    onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                                />
                            </Col>
                        </Row>

                        {/* One Question at a Time */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="One Question at a Time"
                                checked={quiz.oneQuestionAtATime}
                                onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                            />
                        </Form.Group>

                        {/* Webcam Required */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Webcam Required"
                                checked={quiz.webcamRequired}
                                onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
                            />
                        </Form.Group>

                        {/* Lock Questions After Answering */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Lock Questions After Answering"
                                checked={quiz.lockQuestionsAfterAnswering}
                                onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
                            />
                        </Form.Group>
                    </div>

                    {/* Assign Section */}
                    <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3">Assign</h5>

                        {/* Assign To */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Assign to</Form.Label>
                            <div className="border rounded p-2">
                                <span className="badge bg-secondary">Everyone ×</span>
                            </div> 
                        </Form.Group>

                        {/* Due Date */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Due</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={quiz.dueDate}
                                onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                            />
                        </Form.Group>

                        {/* Available From and Until */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Available from</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={quiz.availableDate}
                                        onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Until</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={quiz.availableUntilDate}
                                        onChange={(e) => setQuiz({ ...quiz, availableUntilDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-2 mb-4">
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="danger" onClick={handleSaveAndPublish}>
                            Save & Publish
                        </Button>
                    </div>
                </Form>
            )}
        </Container>
    );
}