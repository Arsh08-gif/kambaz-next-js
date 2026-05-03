"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import * as client from "../../../../../../client";

export default function TrueFalseEditor() {
    const { cid, qid, questionId } = useParams();
    const router = useRouter();
    const isNewQuestion = questionId === "new";

    const [question, setQuestion] = useState({
        _id: "",
        quizId: qid as string,
        courseId: cid as string,
        title: "",
        type: "True/False",
        points: 3,
        question: "",
        choices: [],
        correctAnswer: "True",
        order: 0
    });

    useEffect(() => {
        if (!isNewQuestion) {
            fetchQuestion();
        }
    }, [questionId]);

    const fetchQuestion = async () => {
        try {
            const fetchedQuestion = await client.findQuestionById(questionId as string);
            setQuestion(fetchedQuestion);
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    };

    const handleSave = async () => {
        try {
            // Validate that question text is not empty
            if (!question.question.trim()) {
                alert("Please enter question text");
                return;
            }

            if (isNewQuestion) {
                await client.createQuestion(question);
            } else {
                await client.updateQuestion(questionId as string, question);
            }
            
            // Update quiz points and number of questions
            const quiz = await client.findQuizById(qid as string);
            const allQuestions = await client.findQuestionsForQuiz(qid as string);
            const totalPoints = allQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
            
            await client.updateQuiz({
                ...quiz,
                points: totalPoints + question.points,
                numberOfQuestions: allQuestions.length + (isNewQuestion ? 1 : 0)
            });
            
            router.push(`/Courses/${cid}/Quizzes/${qid}/questions`);
        } catch (error) {
            console.error("Error saving question:", error);
            alert("Error saving question");
        }
    };

    const handleCancel = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/questions`);
    };

    return (
        <Container className="mt-4">
            <div className="border rounded p-4 bg-light">
                {/* Header Row */}
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            value={question.title}
                            onChange={(e) => setQuestion({ ...question, title: e.target.value })}
                            placeholder="Question Title (e.g., Is 2 + 2 = 4?)"
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={question.type}
                            onChange={(e) => setQuestion({ ...question, type: e.target.value })}
                        >
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="True/False">True/False</option>
                            <option value="Fill in the Blank">Fill in the Blank</option>
                        </Form.Select>
                    </Col>
                    <Col md={4} className="d-flex align-items-center justify-content-end">
                        <span className="me-2">pts:</span>
                        <Form.Control
                            type="number"
                            value={question.points}
                            onChange={(e) => setQuestion({ ...question, points: parseInt(e.target.value) || 0 })}
                            min="0"
                            style={{ width: "80px" }}
                        />
                    </Col>
                </Row>

                <hr />

                {/* Instructions */}
                <p className="text-muted small">
                    Enter your question text, then select if True or False is the correct answer.
                </p>

                {/* Question Section */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Question:</Form.Label>
                    <div className="border rounded bg-white p-2">
                        {/* Toolbar - simplified */}
                        {/* <div className="d-flex gap-2 mb-2 border-bottom pb-2">
                            <span className="text-muted small">Edit</span>
                            <span className="text-muted small">View</span>
                            <span className="text-muted small">Insert</span>
                            <span className="text-muted small">Format</span>
                            <span className="text-muted small">Tools</span>
                            <span className="text-muted small">Table</span>
                        </div>
                        <div className="d-flex gap-2 mb-2 border-bottom pb-2 align-items-center">
                            <Form.Select size="sm" style={{ width: "80px" }}>
                                <option>12pt</option>
                            </Form.Select>
                            <Form.Select size="sm" style={{ width: "120px" }}>
                                <option>Paragraph</option>
                            </Form.Select>
                            <Button variant="light" size="sm"><strong>B</strong></Button>
                            <Button variant="light" size="sm"><em>I</em></Button>
                            <Button variant="light" size="sm"><u>U</u></Button>
                        </div> */}
                        
                        {/* Question Text Area */}
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={question.question}
                            onChange={(e) => setQuestion({ ...question, question: e.target.value })}
                            placeholder="Enter your question here..."
                            style={{ border: "none", resize: "none" }}
                        />
                    </div>
                </Form.Group>

                {/* Answers Section */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Answers:</Form.Label>
                    
                    <div className="ms-3">
                        {/* True Option */}
                        <div className="d-flex align-items-center mb-2">
                            {question.correctAnswer === "True" && (
                                <FaArrowRight className="text-success me-2" />
                            )}
                            {question.correctAnswer !== "True" && (
                                <span className="me-4"></span>
                            )}
                            <Form.Check
                                type="radio"
                                id="answer-true"
                                name="correct-answer"
                                label={
                                    <span className={question.correctAnswer === "True" ? "text-success fw-bold" : ""}>
                                        True
                                    </span>
                                }
                                checked={question.correctAnswer === "True"}
                                onChange={() => setQuestion({ ...question, correctAnswer: "True" })}
                            />
                        </div>

                        {/* False Option */}
                        <div className="d-flex align-items-center">
                            {question.correctAnswer === "False" && (
                                <FaArrowRight className="text-success me-2" />
                            )}
                            {question.correctAnswer !== "False" && (
                                <span className="me-4"></span>
                            )}
                            <Form.Check
                                type="radio"
                                id="answer-false"
                                name="correct-answer"
                                label={
                                    <span className={question.correctAnswer === "False" ? "text-success fw-bold" : ""}>
                                        False
                                    </span>
                                }
                                checked={question.correctAnswer === "False"}
                                onChange={() => setQuestion({ ...question, correctAnswer: "False" })}
                            />
                        </div>
                    </div>
                </Form.Group>

                <hr />

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleSave}
                    >
                        Update Question
                    </Button>
                </div>
            </div>
        </Container>
    );
}