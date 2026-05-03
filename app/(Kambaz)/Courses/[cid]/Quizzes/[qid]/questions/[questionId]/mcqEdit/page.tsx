"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import * as client from "../../../../../../client";

export default function MCQEditor() {
    const { cid, qid, questionId } = useParams();
    const router = useRouter();
    const isNewQuestion = questionId === "new";

    const [question, setQuestion] = useState({
        _id: "",
        quizId: qid as string,
        courseId: cid as string,
        title: "",
        type: "Multiple Choice",
        points: 4,
        question: "",
        choices: [
            { text: "", correct: false },
            { text: "", correct: false },
            { text: "", correct: true },
            { text: "", correct: false }
        ],
        correctAnswer: "",
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

    const handleUpdateChoice = (choiceIndex: number, text: string) => {
        const newChoices = [...question.choices];
        newChoices[choiceIndex] = { ...newChoices[choiceIndex], text };
        setQuestion({ ...question, choices: newChoices });
    };

    const handleSetCorrectChoice = (choiceIndex: number) => {
        const newChoices = question.choices.map((c, i) => ({
            ...c,
            correct: i === choiceIndex
        }));
        setQuestion({ ...question, choices: newChoices });
    };

    const handleAddChoice = () => {
        setQuestion({
            ...question,
            choices: [...question.choices, { text: "", correct: false }]
        });
    };

    const handleRemoveChoice = (choiceIndex: number) => {
        if (question.choices.length > 2) {
            const newChoices = question.choices.filter((_, idx) => idx !== choiceIndex);
            setQuestion({ ...question, choices: newChoices });
        }
    };

    const handleSave = async () => {
        try {
            // Validate that at least one answer is marked correct
            const hasCorrectAnswer = question.choices.some(c => c.correct);
            if (!hasCorrectAnswer) {
                alert("Please select at least one correct answer");
                return;
            }

            // Validate that all choices have text
            const hasEmptyChoice = question.choices.some(c => !c.text.trim());
            if (hasEmptyChoice) {
                alert("Please fill in all answer choices");
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
                            placeholder="Question Title (e.g., Easy Question)"
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
                    Enter your question and multiple answers, then select the one correct answer.
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
                        </div> */}
                        {/* <div className="d-flex gap-2 mb-2 border-bottom pb-2 align-items-center">
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
                    
                    {question.choices.map((choice, idx) => (
                        <div key={idx} className="mb-3">
                            <div className="d-flex align-items-start gap-2">
                                {/* Radio button for correct answer */}
                                <div className="mt-2">
                                    <Form.Check
                                        type="radio"
                                        name="correct-answer"
                                        checked={choice.correct}
                                        onChange={() => handleSetCorrectChoice(idx)}
                                    />
                                </div>
                                
                                {/* Label */}
                                <div className="mt-2" style={{ width: "120px" }}>
                                    <span className={choice.correct ? "text-success fw-bold" : ""}>
                                        {choice.correct ? "Correct Answer" : "Possible Answer"}
                                    </span>
                                </div>
                                
                                {/* Answer input */}
                                <div className="flex-grow-1">
                                    <Form.Control
                                        type="text"
                                        value={choice.text}
                                        onChange={(e) => handleUpdateChoice(idx, e.target.value)}
                                        placeholder={`Answer ${idx + 1}`}
                                    />
                                </div>
                                
                                {/* Delete button - show only if more than 2 answers */}
                                {question.choices.length > 2 && (
                                    <div>
                                        <Button
                                            variant="link"
                                            className="text-muted p-0"
                                            onClick={() => handleRemoveChoice(idx)}
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
                        onClick={handleAddChoice}
                    >
                        + Add Another Answer
                    </Button>
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