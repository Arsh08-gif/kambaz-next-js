"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import { Button, Container, Card, Form, Alert, ProgressBar, ListGroup } from "react-bootstrap";
import * as client from "../../../../client";
import { RootState } from "../../../../../store";

export default function TakeQuiz() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);

    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [canTakeQuiz, setCanTakeQuiz] = useState(true);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [startTime] = useState(new Date());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);


    useEffect(() => {
        fetchQuizData();
    }, [qid]);

    const fetchQuizData = async () => {
        try {
            if (!currentUser) return;
            const [quizData, questionsData, attemptInfo] = await Promise.all([
                client.findQuizById(qid as string),
                client.findQuestionsForQuiz(qid as string),
                client.getAttemptInfo(qid as string, currentUser._id)
            ]);

            setQuiz(quizData);
            setQuestions(questionsData);
            setTotalAttempts(attemptInfo.totalAttempts);

            // Check if student can take quiz
            if (quizData.multipleAttempts) {
                setCanTakeQuiz(attemptInfo.totalAttempts < quizData.numberOfAttempts);
            } else {
                setCanTakeQuiz(attemptInfo.totalAttempts === 0);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
    };

    const jumpToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmit = async () => {
        // Validate all questions are answered
        const unanswered = questions.filter(q => !answers[q._id]);
        if (unanswered.length > 0) {
            toast.error(`Please answer all questions. ${unanswered.length} question(s) remaining.`, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            //alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
            return;
        }
        if (!currentUser) return;
        const endTime = new Date();
        const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

        const attemptData = {
            userId: currentUser._id,
            courseId: cid,
            answers: Object.keys(answers).map(questionId => ({
                questionId,
                answer: answers[questionId]
            })),
            startedAt: startTime,
            timeSpent
        };

        try {
            const result = await client.submitQuizAttempt(qid as string, attemptData);
            router.push(`/Courses/${cid}/Quizzes/${qid}/attempts/${result._id}`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Failed to submit quiz");
        }
        setIsSubmitted(true);
    };

    if (loading) {
        return <Container className="mt-4">Loading quiz...</Container>;
    }

    if (!canTakeQuiz) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    <Alert.Heading>Maximum Attempts Reached</Alert.Heading>
                    <p>
                        You have used all {quiz.multipleAttempts ? quiz.numberOfAttempts : 1} attempt(s) for this quiz.
                    </p>
                    <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
                        Back to Quizzes
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <ToastContainer />
            {/* Quiz Header */}
            <Card className="mb-4">
                <Card.Body>
                    <h2>{quiz.title}</h2>
                    <p className="text-muted">{quiz.description}</p>
                    <div className="d-flex justify-content-between">
                        <div>
                            <strong>Points:</strong> {quiz.points}
                        </div>
                        <div>
                            <strong>Questions:</strong> {quiz.numberOfQuestions}
                        </div>
                        {quiz.timeLimit > 0 && (
                            <div>
                                <strong>Time Limit:</strong> {quiz.timeLimit} minutes
                            </div>
                        )}
                        <div>
                            <strong>Attempt:</strong> {totalAttempts + 1}
                            {quiz.multipleAttempts && ` of ${quiz.numberOfAttempts}`}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <div>

                {!isSubmitted && (
                    <div
                        className="border rounded p-3 bg-light"
                        style={{
                            width: '280px',
                            height: 'fit-content',
                            position: 'sticky',
                            top: '20px'
                        }}
                    >
                        <h5 className="mb-3">Quiz Navigation</h5>
                        <p className="small text-muted mb-3">
                            Click on any question to jump to it
                        </p>
                        <ListGroup>
                            {questions.map((question, index) => (
                                <ListGroup.Item
                                    key={question._id}
                                    action
                                    active={currentQuestionIndex === index}
                                    onClick={() => jumpToQuestion(index)}
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>
                                        <strong>Question {index + 1}</strong>
                                        <br />
                                        <small className="text-muted">{question.points} pts</small>
                                    </span>
                                    {answers[question._id] ? (
                                        <span className="badge bg-success">✓</span>
                                    ) : (
                                        <span className="badge bg-secondary">-</span>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        {/* Progress Summary */}
                        <div className="mt-3 p-2 bg-white rounded border">
                            <small className="text-muted">Progress:</small>
                            <div className="d-flex justify-content-between">
                                <strong>{Object.keys(answers).length} / {questions.length}</strong>
                                <span className="text-muted">Answered</span>
                            </div>
                        </div>
                    </div>
                )}

                <Card className="mb-4">
                    <Card.Body>
                        {renderQuestion(questions[currentQuestionIndex])}
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-between">
                    <Button
                        variant="secondary"
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <Button
                            variant="primary"
                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button variant="success" onClick={handleSubmit}>
                            Submit Quiz
                        </Button>
                    )}
                </div>
            </div>
        </Container>
    );

    function renderQuestion(question: any) {
        return (
            <div>
                <p className="fw-bold mb-3">
                    {question.question} <span className="text-muted">({question.points} pts)</span>
                </p>

                {question.type === "Multiple Choice" && (
                    <div>
                        {question.choices.map((choice: any, idx: number) => (
                            <Form.Check
                                key={idx}
                                type="radio"
                                id={`${question._id}-choice-${idx}`}
                                label={choice.text}
                                name={`question-${question._id}`}
                                checked={answers[question._id] === choice.text}
                                onChange={() => handleAnswerChange(question._id, choice.text)}
                                className="mb-2"
                            />
                        ))}
                    </div>
                )}

                {question.type === "True/False" && (
                    <div>
                        {["True", "False"].map((option) => (
                            <Form.Check
                                key={option}
                                type="radio"
                                id={`${question._id}-${option}`}
                                label={option}
                                name={`question-${question._id}`}
                                checked={answers[question._id] === option}
                                onChange={() => handleAnswerChange(question._id, option)}
                                className="mb-2"
                            />
                        ))}
                    </div>
                )}

                {question.type === "Fill in the Blank" && (
                    <Form.Control
                        type="text"
                        placeholder="Type your answer here"
                        value={answers[question._id] || ""}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    />
                )}
            </div>
        );
    }
}