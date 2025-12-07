"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Button, Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as client from "../../../client";
import { FaArrowLeft } from "react-icons/fa6";

export default function QuizDetails() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    
    const isFaculty = currentUser?.role === "FACULTY";
    const isStudent = currentUser?.role === "STUDENT";

    useEffect(() => {
        fetchQuiz();
    }, [qid]);

    const fetchQuiz = async () => {
        try {
            const fetchedQuiz = await client.findQuizById(qid as string);
            setQuiz(fetchedQuiz);
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
    };

    const handlePreview = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/preview`);
    };

    const handleEdit = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/edit`);
    };

    const handleStartQuiz = () => {
        if (quiz.numberOfQuestions === 0) {
        toast.error("Cannot start quiz: No questions are available for this quiz yet.", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return;
    }
        router.push(`/Courses/${cid}/Quizzes/${qid}/take`);
    };

    const handleBack = () => {
        router.push(`/Courses/${cid}/Quizzes`);
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        }) + " at " + d.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-4">
            <ToastContainer />
            <div className="mb-3">
                <Button 
                    variant="outline-secondary"
                    onClick={handleBack}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Quizzes
                </Button>
            </div>
            {/* Header Buttons */}
            {isFaculty && (
                <div className="d-flex justify-content-end mb-3 gap-2">
                    <Button 
                        variant="outline-secondary"
                        onClick={handlePreview}
                    >
                        Preview
                    </Button>
                    <Button 
                        variant="outline-secondary"
                        onClick={handleEdit}
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Edit
                    </Button>
                </div>
            )}

            {isStudent && (
                <div className="mb-4">
                    <Button 
                        variant="danger" 
                        size="lg"
                        onClick={handleStartQuiz}
                    >
                        Start Quiz
                    </Button>
                </div>
            )}

            <div className="border rounded p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <h2 className="mb-4">{quiz.title}</h2>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Quiz Type
                    </Col>
                    <Col md={8}>
                        {quiz.quizType}
                    </Col>
                </Row>
                
                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Points
                    </Col>
                    <Col md={8}>
                        {quiz.points}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Assignment Group
                    </Col>
                    <Col md={8}>
                        {quiz.assignmentGroup}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Shuffle Answers
                    </Col>
                    <Col md={8}>
                        {quiz.shuffleAnswers ? "Yes" : "No"}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Time Limit
                    </Col>
                    <Col md={8}>
                        {quiz.timeLimit} Minutes
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Multiple Attempts
                    </Col>
                    <Col md={8}>
                        {quiz.multipleAttempts ? "Yes" : "No"}
                    </Col>
                </Row>

                {quiz.multipleAttempts && (
                    <Row className="mb-3">
                        <Col md={4} className="text-end fw-bold">
                            How Many Attempts
                        </Col>
                        <Col md={8}>
                            {quiz.numberOfAttempts}
                        </Col>
                    </Row>
                )}

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        View Responses
                    </Col>
                    <Col md={8}>
                        Always
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Show Correct Answers
                    </Col>
                    <Col md={8}>
                        {quiz.showCorrectAnswers === "immediately" && "Immediately"}
                        {quiz.showCorrectAnswers === "after_last_attempt" && "After Last Attempt"}
                        {quiz.showCorrectAnswers === "after_due_date" && "After Due Date"}
                        {quiz.showCorrectAnswers === "never" && "Never"}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        One Question at a Time
                    </Col>
                    <Col md={8}>
                        {quiz.oneQuestionAtATime ? "Yes" : "No"}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Require Respondus LockDown Browser
                    </Col>
                    <Col md={8}>
                        No
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Required to View Quiz Results
                    </Col>
                    <Col md={8}>
                        No
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Webcam Required
                    </Col>
                    <Col md={8}>
                        {quiz.webcamRequired ? "Yes" : "No"}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4} className="text-end fw-bold">
                        Lock Questions After Answering
                    </Col>
                    <Col md={8}>
                        {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
                    </Col>
                </Row>

                {/* Availability Table */}
                <div className="mt-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Due</th>
                                <th>For</th>
                                <th>Available from</th>
                                <th>Until</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{formatDate(quiz.dueDate)}</td>
                                <td>Everyone</td>
                                <td>{formatDate(quiz.availableDate)}</td>
                                <td>{formatDate(quiz.availableUntilDate)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>
    );
}