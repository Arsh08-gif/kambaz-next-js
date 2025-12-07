"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Card, Form, Row, Col } from "react-bootstrap";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import * as client from "../../../../client";
import { log } from "console";

export default function QuizQuestionsList() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    useEffect(() => {
        fetchQuizAndQuestions();
    }, [qid]);

    const fetchQuizAndQuestions = async () => {
        try {
            const fetchedQuiz = await client.findQuizById(qid as string);
            console.log("quiz " + JSON.stringify(fetchedQuiz));

            setQuiz(fetchedQuiz);

            const fetchedQuestions = await client.findQuestionsForQuiz(qid as string);
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error("Error fetching quiz and questions:", error);
        }
    };

    const calculateTotalPoints = () => {
        return questions.reduce((total, q) => total + (q.points || 0), 0);
    };

    const handleAddQuestion = () => {
        // Create new question with default values (Multiple Choice)
        const newQuestion = {
            _id: `temp-${Date.now()}`, // Temporary ID
            quizId: qid as string,
            courseId: cid as string,
            title: `Question ${questions.length + 1}`,
            type: "Multiple Choice",
            points: 1,
            question: "",
            choices: [
                { text: "", correct: true },
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false }
            ],
            correctAnswer: "",
            order: questions.length + 1,
            isNew: true // Flag to identify unsaved questions
        };

        // Add to bottom of list and set as editing
        setQuestions([...questions, newQuestion]);
        setEditingQuestionId(newQuestion._id);
    };

    const handleEditQuestion = (questionId: string, questionType: string) => {
        // Navigate to specific editor based on question type
        if (questionType === "Multiple Choice") {
            router.push(`/Courses/${cid}/Quizzes/${qid}/questions/${questionId}/mcqEdit`);
        } else if (questionType === "True/False") {
            router.push(`/Courses/${cid}/Quizzes/${qid}/questions/${questionId}/tfEdit`);
        } else if (questionType === "Fill in the Blank") {
            router.push(`/Courses/${cid}/Quizzes/${qid}/questions/${questionId}/fbEdit`);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                // Only call API if it's not a new unsaved question
                if (!questionId.startsWith("temp-")) {
                    await client.deleteQuestion(questionId);
                }
                setQuestions(questions.filter(q => q._id !== questionId));

                // Update quiz points
                const updatedQuestions = questions.filter(q => q._id !== questionId);
                const totalPoints = updatedQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
                await client.updateQuiz({
                    ...quiz,
                    points: totalPoints,
                    numberOfQuestions: updatedQuestions.length
                });
            } catch (error) {
                console.error("Error deleting question:", error);
            }
        }
    };

    const handleUpdateQuestion = (questionId: string, field: string, value: any) => {
        console.log("inside question onChange ");

        setQuestions(questions.map(q => {
            //q._id === questionId ? { ...q, [field]: value } : q
            if (q._id === questionId) {
                if (field === "type") {
                    if (value === "Multiple Choice") {
                        return {
                            ...q,
                            type: value,
                            choices: [
                                { text: "", correct: true },
                                { text: "", correct: false },
                                { text: "", correct: false },
                                { text: "", correct: false }
                            ],
                            correctAnswer: "" // Clear correctAnswer for MC
                        };
                    } else if (value === "True/False") {
                        return {
                            ...q,
                            type: value,
                            correctAnswer: "True",
                            choices: [] // Remove choices for T/F
                        };
                    } else if (value === "Fill in the Blank") {
                        return {
                            ...q,
                            type: value,
                            correctAnswer: "",
                            choices: [] // Remove choices for Fill in the Blank
                        };
                    }
                }
                return { ...q, [field]: value };
            }
            return q;
        }
        ));
    };

    const handleUpdateChoice = (questionId: string, choiceIndex: number, field: string, value: any) => {
        setQuestions(questions.map(q => {
            if (q._id === questionId) {
                const newChoices = [...q.choices];
                newChoices[choiceIndex] = { ...newChoices[choiceIndex], [field]: value };
                return { ...q, choices: newChoices };
            }
            return q;
        }));
    };

    const handleSetCorrectChoice = (questionId: string, choiceIndex: number) => {
        setQuestions(questions.map(q => {
            if (q._id === questionId) {
                const newChoices = q.choices.map((c: any, i: number) => ({
                    ...c,
                    correct: i === choiceIndex
                }));
                return { ...q, choices: newChoices };
            }
            return q;
        }));
    };

    const handleAddChoice = (questionId: string) => {
        setQuestions(questions.map(q => {
            if (q._id === questionId) {
                return {
                    ...q,
                    choices: [...q.choices, { text: "", correct: false }]
                };
            }
            return q;
        }));
    };

    const handleRemoveChoice = (questionId: string, choiceIndex: number) => {
        setQuestions(questions.map(q => {
            if (q._id === questionId && q.choices.length > 2) {
                const newChoices = q.choices.filter((_: any, idx: number) => idx !== choiceIndex);
                return { ...q, choices: newChoices };
            }
            return q;
        }));
    };

    const handleSaveQuestion = async (questionId: string) => {
        try {
            const question = questions.find(q => q._id === questionId);
            console.log("question to save " + JSON.stringify(question));
            console.log("is new " + question.isNew);


            if (!question) return;

            if (question.isNew) {
                const { _id, isNew, ...questionData } = question;
                let cleanedQuestionData = { ...questionData };
                if (questionData.type === "True/False" || questionData.type === "Fill in the Blank") {
                    delete cleanedQuestionData.choices;
                } else if (questionData.type === "Multiple Choice") {
                    cleanedQuestionData.choices = questionData.choices
                        .filter((c: any) => c.text && c.text.trim() !== "")
                        .map((c: any) => ({
                            text: c.text.trim(),
                            correct: c.correct
                        }));
                }
                console.log("cleaned question to save " + JSON.stringify(cleanedQuestionData));

                const savedQuestion = await client.createQuestion(questionData);

                // Replace temp question with saved question
                setQuestions(questions.map(q =>
                    q._id === questionId ? savedQuestion : q
                ));
            }
            else {
                let cleanedQuestion = { ...question };

                if (question.type === "True/False" || question.type === "Fill in the Blank") {
                    delete cleanedQuestion.choices;
                } else if (question.type === "Multiple Choice") {
                    cleanedQuestion.choices = question.choices
                        .filter((c: any) => c.text && c.text.trim() !== "")
                        .map((c: any) => ({
                            text: c.text.trim(),
                            correct: c.correct
                        }));
                }
                await client.updateQuestion(questionId, cleanedQuestion);
                // await client.updateQuestion(questionId, question);
            }

            setEditingQuestionId(null);

            // Update quiz points and number of questions
            const totalPoints = calculateTotalPoints();
            await client.updateQuiz({
                ...quiz,
                points: totalPoints,
                numberOfQuestions: questions.length
            });
        } catch (error) {
            console.error("Error saving question:", error);
            alert("Error saving question");
        }
    };

    const handleCancelEdit = (questionId: string) => {
        const question = questions.find(q => q._id === questionId);

        // If it's a new unsaved question, remove it
        if (question?.isNew) {
            setQuestions(questions.filter(q => q._id !== questionId));
        } else {
            // If editing existing question, reload to discard changes
            fetchQuizAndQuestions();
        }

        setEditingQuestionId(null);
    };

    const handleCancel = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/edit`);
    };

    const handleSave = async () => {
        try {
            // Check if there are any unsaved questions
            const hasUnsavedQuestions = questions.some(q => q.isNew);
            if (hasUnsavedQuestions) {
                alert("Please save or cancel all questions before saving the quiz.");
                return;
            }

            // Update quiz with total points
            const totalPoints = calculateTotalPoints();
            await client.updateQuiz({
                ...quiz,
                points: totalPoints,
                numberOfQuestions: questions.length
            });
            router.push(`/Courses/${cid}/Quizzes/${qid}/edit`);
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Error saving quiz");
        }
    };

    const renderQuestionEditor = (question: any) => {
        const isEditing = editingQuestionId === question._id;

        if (!isEditing) {
            // Preview Mode
            return (
                <Card className="mb-3" key={question._id}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                                <h5>{question.title}</h5>
                                <p className="mb-2">{question.question || "No question text"}</p>
                                <small className="text-muted">
                                    {question.type} | {question.points} pts
                                </small>

                                {question.type === "Multiple Choice" && question.choices && (
                                    <div className="mt-2">
                                        {question.choices.map((choice: any, idx: number) => (
                                            <div key={idx} className="ms-3">
                                                <Form.Check
                                                    type="radio"
                                                    label={choice.text || `Choice ${idx + 1}`}
                                                    checked={choice.correct}
                                                    disabled
                                                    className={choice.correct ? "text-success fw-bold" : ""}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {question.type === "True/False" && (
                                    <div className="mt-2 ms-3">
                                        <div className={question.correctAnswer === "True" ? "text-success fw-bold" : ""}>
                                            ○ True
                                        </div>
                                        <div className={question.correctAnswer === "False" ? "text-success fw-bold" : ""}>
                                            ○ False
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleEditQuestion(question._id, question.type)}
                                >
                                    <FaPencilAlt />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteQuestion(question._id)}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            );
        }

        // Edit Mode
        return (
            <Card className="mb-3" key={question._id}>
                <Card.Body>
                    <Form>
                        {/* Title and Type */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Question Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={question.title}
                                        onChange={(e) => handleUpdateQuestion(question._id, 'title', e.target.value)}
                                        placeholder="Question title"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Question Type</Form.Label>
                                    <Form.Select
                                        value={question.type}
                                        onChange={(e) => handleUpdateQuestion(question._id, 'type', e.target.value)}
                                    >
                                        <option value="Multiple Choice">Multiple Choice</option>
                                        <option value="True/False">True/False</option>
                                        <option value="Fill in the Blank">Fill in the Blank</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Points</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={question.points}
                                        onChange={(e) => handleUpdateQuestion(question._id, 'points', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Question Text */}
                        <Form.Group className="mb-3">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={question.question}
                                onChange={(e) => handleUpdateQuestion(question._id, 'question', e.target.value)}
                                placeholder="Enter your question"
                            />
                        </Form.Group>

                        {/* Multiple Choice Options */}
                        {question.type === "Multiple Choice" && (
                            <div className="mb-3">
                                <Form.Label>Answers</Form.Label>
                                {question.choices?.map((choice: any, idx: number) => (
                                    <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
                                        <Form.Check
                                            type="radio"
                                            name={`correct-${question._id}`}
                                            checked={choice.correct}
                                            onChange={() => handleSetCorrectChoice(question._id, idx)}
                                            label=""
                                        />
                                        <Form.Control
                                            type="text"
                                            value={choice.text}
                                            onChange={(e) => handleUpdateChoice(question._id, idx, 'text', e.target.value)}
                                            placeholder={`Answer ${idx + 1}`}
                                        />
                                        {question.choices.length > 2 && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveChoice(question._id, idx)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleAddChoice(question._id)}
                                >
                                    + Add Answer
                                </Button>
                            </div>
                        )}

                        {/* True/False Options */}
                        {question.type === "True/False" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Correct Answer</Form.Label>
                                <div>
                                    <Form.Check
                                        type="radio"
                                        label="True"
                                        name={`tf-${question._id}`}
                                        checked={question.correctAnswer === "True"}
                                        onChange={() => handleUpdateQuestion(question._id, 'correctAnswer', 'True')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="False"
                                        name={`tf-${question._id}`}
                                        checked={question.correctAnswer === "False"}
                                        onChange={() => handleUpdateQuestion(question._id, 'correctAnswer', 'False')}
                                    />
                                </div>
                            </Form.Group>
                        )}

                        {/* Fill in the Blank */}
                        {question.type === "Fill in the Blank" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Correct Answer(s)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={question.correctAnswer || ""}
                                    onChange={(e) => handleUpdateQuestion(question._id, 'correctAnswer', e.target.value)}
                                    placeholder="Enter correct answer (use commas for multiple answers)"
                                />
                                <Form.Text className="text-muted">
                                    Separate multiple acceptable answers with commas
                                </Form.Text>
                            </Form.Group>
                        )}

                        {/* Action Buttons */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => handleCancelEdit(question._id)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleSaveQuestion(question._id)}
                            >
                                {question.isNew ? "Save Question" : "Update Question"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        );
    };

    return (
        <Container className="mt-4">
            {/* Header with Points */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>{quiz?.title || "Quiz Questions"}</h3>
                <h4>Points: {calculateTotalPoints()}</h4>
            </div>

            {/* Tabs */}
            <div className="border-bottom mb-4">
                <Button
                    variant="link"
                    className="text-decoration-none"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
                >
                    Details
                </Button>
                <Button
                    variant="link"
                    className="text-decoration-none text-danger"
                    style={{ borderRadius: 0 }}
                >
                    Questions
                </Button>
            </div>

            {/* New Question Button */}
            <div className="text-center mb-4">
                <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={handleAddQuestion}
                >
                    + New Question
                </Button>
            </div>

            <hr />

            {/* Questions List */}
            <div className="mb-4">
                {questions.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <p>No questions yet. Click "New Question" to add one.</p>
                    </div>
                ) : (
                    questions.map((question) => renderQuestionEditor(question))
                )}
            </div>

            {/* Bottom Action Buttons */}
            <div className="d-flex justify-content-center gap-3 mb-4">
                <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    size="lg"
                    onClick={handleSave}
                >
                    Save
                </Button>
            </div>
        </Container>
    );
}