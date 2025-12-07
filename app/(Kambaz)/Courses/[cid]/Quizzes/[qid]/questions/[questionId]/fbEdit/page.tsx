"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import * as client from "../../../../../../client";

export default function FillInBlankEditor() {
    const { cid, qid, questionId } = useParams();
    const router = useRouter();
    const isNewQuestion = questionId === "new";

    const [question, setQuestion] = useState({
        _id: "",
        quizId: qid as string,
        courseId: cid as string,
        title: "",
        type: "Fill in the Blank",
        points: 4,
        question: "",
        choices: [],
        correctAnswer: "",
        possibleAnswers: [""], // Array of possible correct answers
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
            
            // Parse correctAnswer string into array if it exists
            const possibleAnswers = fetchedQuestion.correctAnswer 
                ? fetchedQuestion.correctAnswer.split(',').map((a: string) => a.trim())
                : [""];
            
            setQuestion({
                ...fetchedQuestion,
                possibleAnswers
            });
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    };

    const handleUpdateAnswer = (index: number, value: string) => {
        const newAnswers = [...question.possibleAnswers];
        newAnswers[index] = value;
        setQuestion({ ...question, possibleAnswers: newAnswers });
    };

    const handleAddAnswer = () => {
        setQuestion({
            ...question,
            possibleAnswers: [...question.possibleAnswers, ""]
        });
    };

    const handleRemoveAnswer = (index: number) => {
        if (question.possibleAnswers.length > 1) {
            const newAnswers = question.possibleAnswers.filter((_, idx) => idx !== index);
            setQuestion({ ...question, possibleAnswers: newAnswers });
        }
    };

    const handleSave = async () => {
        try {
            // Validate question text
            if (!question.question.trim()) {
                alert("Please enter question text");
                return;
            }

            // Filter out empty answers and validate
            const validAnswers = question.possibleAnswers.filter(a => a.trim() !== "");
            if (validAnswers.length === 0) {
                alert("Please enter at least one possible answer");
                return;
            }

            // Combine all possible answers into comma-separated string
            const questionToSave = {
                ...question,
                correctAnswer: validAnswers.join(','),
                possibleAnswers: undefined // Remove this field before saving
            };

            if (isNewQuestion) {
                await client.createQuestion(questionToSave);
            } else {
                await client.updateQuestion(questionId as string, questionToSave);
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
                            placeholder="Question Title (e.g., Easy fill the blank)"
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={question.type}
                            onChange={(e) => setQuestion({ ...question, type: e.target.value })}
                        >
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="True/False">True/False</option>
                            <option value="Fill in the Blank">Fill In the Blank</option>
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
                    Enter your question text, then define all possible correct answers for the blank. 
                    Students will see the question followed by a small text box to type their answer.
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
                            placeholder="Enter your question here (e.g., How much is 2 + 2 = _______?)"
                            style={{ border: "none", resize: "none" }}
                        />
                    </div>
                </Form.Group>

                {/* Answers Section */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Answers:</Form.Label>
                    
                    {question.possibleAnswers.map((answer, idx) => (
                        <div key={idx} className="mb-3">
                            <div className="d-flex align-items-center gap-2">
                                {/* Label */}
                                <div style={{ width: "140px" }}>
                                    <span className="text-muted">Possible Answer:</span>
                                </div>
                                
                                {/* Answer input */}
                                <div className="flex-grow-1">
                                    <Form.Control
                                        type="text"
                                        value={answer}
                                        onChange={(e) => handleUpdateAnswer(idx, e.target.value)}
                                        placeholder={`Answer ${idx + 1}`}
                                    />
                                </div>
                                
                                {/* Delete button - only show if more than 1 answer */}
                                {question.possibleAnswers.length > 1 && (
                                    <div>
                                        <Button
                                            variant="link"
                                            className="text-muted p-0"
                                            onClick={() => handleRemoveAnswer(idx)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {/* Add Another Answer Button */}
                    <Button
                        variant="link"
                        className="text-danger text-decoration-none p-0"
                        onClick={handleAddAnswer}
                    >
                        + Add Another Answer
                    </Button>
                </Form.Group>

                {/* Case Sensitivity Note */}
                <div className="mb-3">
                    <Form.Text className="text-muted">
                        <strong>Note:</strong> Answers are case-insensitive by default. 
                        Students can enter answers in any case and they will be matched.
                    </Form.Text>
                </div>

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