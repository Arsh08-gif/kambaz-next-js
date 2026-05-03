"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Card, Form, Alert, ListGroup } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import * as client from "../../../../client";

export default function QuizPreview() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [results, setResults] = useState<{ [key: string]: boolean }>({});
    const [startTime] = useState(new Date());

    useEffect(() => {
        fetchQuizAndQuestions();
    }, [qid]);

    const fetchQuizAndQuestions = async () => {
        try {
            const fetchedQuiz = await client.findQuizById(qid as string);
            setQuiz(fetchedQuiz);

            const fetchedQuestions = await client.findQuestionsForQuiz(qid as string);
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error("Error fetching quiz and questions:", error);
        }
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
    };

    const checkAnswer = (question: any, studentAnswer: string): boolean => {
        if (question.type === "Multiple Choice") {
            const correctChoice = question.choices.find((c: any) => c.correct);
            return correctChoice?.text.toLowerCase().trim() === studentAnswer.toLowerCase().trim();
        } else if (question.type === "True/False") {
            return question.correctAnswer === studentAnswer;
        } else if (question.type === "Fill in the Blank") {
            const possibleAnswers = question.correctAnswer
                .split(',')
                .map((a: string) => a.trim().toLowerCase());
            return possibleAnswers.includes(studentAnswer.toLowerCase().trim());
        }
        return false;
    };

    const handleSubmit = () => {
        let totalScore = 0;
        const questionResults: { [key: string]: boolean } = {};

        questions.forEach((question) => {
            const studentAnswer = answers[question._id];
            const isCorrect = studentAnswer ? checkAnswer(question, studentAnswer) : false;

            questionResults[question._id] = isCorrect;
            if (isCorrect) {
                totalScore += question.points;
            }
        });

        setResults(questionResults);
        setScore(totalScore);
        setIsSubmitted(true);
        window.scrollTo(0, 0);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleKeepEditing = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/questions`);
    };

    const jumpToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }) + " at " + date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (!quiz || questions.length === 0) {
        return <Container className="mt-4">No Questions Available For this Quiz</Container>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const oneQuestionAtATime = quiz.oneQuestionAtATime;

    return (
        <Container className="mt-4">
            <div className="border rounded p-4">
                {/* Header */}
                <h2>{quiz.title}</h2>

                {/* Preview Warning */}
                <Alert variant="warning" className="d-flex align-items-center">
                    <span className="me-2">⚠️</span>
                    This is a preview of the published version of the quiz
                </Alert>

                {/* Started Time */}
                <p className="text-muted">Started: {formatDate(startTime)}</p>

                {/* Quiz Instructions */}
                {quiz.description && !isSubmitted && (
                    <div className="mb-4">
                        <h5>Quiz Instructions</h5>
                        <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
                    </div>
                )}

                {/* Results Summary */}
                {isSubmitted && (
                    <div className="mb-4">
                        <Alert variant="info">
                            <h4>Quiz Results</h4>
                            <p className="mb-0">
                                <strong>Score: {score} / {quiz.points} points</strong>
                            </p>
                            <p className="mb-0">
                                Percentage: {quiz.points > 0 ? ((score / quiz.points) * 100).toFixed(2) : 0}%
                            </p>
                        </Alert>
                    </div>
                )}

                {/* Question Navigation */}
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

                <hr />
                {/* Questions Display */}
                {!isSubmitted && (
                    <div>
                        <Card className="mb-4">
                            <Card.Header className="bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Question {currentQuestionIndex + 1}</h5>
                                    <span>{currentQuestion.points} pts</span>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {renderQuestion(currentQuestion, answers[currentQuestion._id], isSubmitted, results[currentQuestion._id])}
                            </Card.Body>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="d-flex justify-content-between mb-4">
                            <Button
                                variant="secondary"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </Button>

                            {currentQuestionIndex < questions.length - 1 ? (
                                <Button
                                    variant="primary"
                                    onClick={handleNext}
                                >
                                    Next →
                                </Button>
                            ) : (
                                <Button
                                    variant="danger"
                                    onClick={handleSubmit}
                                >
                                    Submit Quiz
                                </Button>
                            )}
                        </div>
                    </div>
                )}



                {/* Bottom Actions */}
                <div className="border-top pt-3">
                    <p className="text-muted">Quiz saved at {formatDate(new Date())}</p>
                    {!isSubmitted && (
                        <Button
                            variant="outline-secondary"
                            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
                        >
                            Save & Exit
                        </Button>
                    )}
                </div>
            </div>

            {/* Keep Editing Button */}
            <div className="mt-4">
                <Button
                    variant="outline-secondary"
                    onClick={handleKeepEditing}
                >
                    <FaPencilAlt className="me-2" />
                    Keep Editing This Quiz
                </Button>
                <Button className="ms-2"
                    variant="outline-secondary"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
                    Back to Quizzes
                </Button>
            </div>

            {/* Questions Navigation Sidebar */}
            {isSubmitted && (
                <div className="mt-4 border rounded p-3">
                    <h5>Questions</h5>
                    <ul className="list-unstyled">
                        {questions.map((question, index) => (
                            // <li key={question._id} className="mb-2">
                            //     <Button
                            //         variant="link"
                            //         className={`text-decoration-none ${results[question._id] ? 'text-success' : 'text-danger'
                            //             }`}
                            //         onClick={() => {
                            //             const element = document.getElementById(`question-${question._id}`);
                            //             element?.scrollIntoView({ behavior: 'smooth' });
                            //         }}
                            //     >
                            //         {results[question._id] ? '✓' : '?'} Question {index + 1}
                            //     </Button>
                            // </li>

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
                    </ul>
                </div>
            )}
        </Container>
    );

    function renderQuestion(question: any, answer: string, submitted: boolean, isCorrect: boolean) {
        return (
            <div id={`question-${question._id}`}>
                {/* Question Text */}
                <div className="mb-3">
                    <p className="fw-bold">{question.question}</p>
                </div>

                {/* Result Indicator */}
                {submitted && (
                    <Alert variant={isCorrect ? "success" : "danger"} className="mb-3">
                        {isCorrect ? (
                            <span>✓ Correct! ({question.points} pts)</span>
                        ) : (
                            <span>✗ Incorrect (0 pts)</span>
                        )}
                    </Alert>
                )}

                {/* Multiple Choice */}
                {question.type === "Multiple Choice" && (
                    <div>
                        {question.choices.map((choice: any, idx: number) => {
                            const isSelected = answer === choice.text;
                            const showCorrect = submitted && choice.correct;
                            const showIncorrect = submitted && isSelected && !choice.correct;

                            return (
                                <Form.Check
                                    key={idx}
                                    type="radio"
                                    id={`${question._id}-choice-${idx}`}
                                    label={choice.text}
                                    name={`question-${question._id}`}
                                    checked={isSelected}
                                    onChange={() => !submitted && handleAnswerChange(question._id, choice.text)}
                                    disabled={submitted}
                                    className={`mb-2 ${showCorrect ? 'text-success fw-bold' :
                                        showIncorrect ? 'text-danger' : ''
                                        }`}
                                />
                            );
                        })}
                    </div>
                )}

                {/* True/False */}
                {question.type === "True/False" && (
                    <div>
                        <Form.Check
                            type="radio"
                            id={`${question._id}-true`}
                            label="True"
                            name={`question-${question._id}`}
                            checked={answer === "True"}
                            onChange={() => !submitted && handleAnswerChange(question._id, "True")}
                            disabled={submitted}
                            className={`mb-2 ${submitted && question.correctAnswer === "True" ? 'text-success fw-bold' :
                                submitted && answer === "True" && question.correctAnswer !== "True" ? 'text-danger' : ''
                                }`}
                        />
                        <Form.Check
                            type="radio"
                            id={`${question._id}-false`}
                            label="False"
                            name={`question-${question._id}`}
                            checked={answer === "False"}
                            onChange={() => !submitted && handleAnswerChange(question._id, "False")}
                            disabled={submitted}
                            className={`mb-2 ${submitted && question.correctAnswer === "False" ? 'text-success fw-bold' :
                                submitted && answer === "False" && question.correctAnswer !== "False" ? 'text-danger' : ''
                                }`}
                        />
                    </div>
                )}

                {/* Fill in the Blank */}
                {question.type === "Fill in the Blank" && (
                    <div>
                        <Form.Control
                            type="text"
                            value={answer || ""}
                            onChange={(e) => !submitted && handleAnswerChange(question._id, e.target.value)}
                            placeholder="Enter your answer"
                            disabled={submitted}
                            className={submitted ? (isCorrect ? 'border-success' : 'border-danger') : ''}
                        />
                        {submitted && (
                            <Form.Text className="text-muted mt-2 d-block">
                                Possible correct answers: {question.correctAnswer}
                            </Form.Text>
                        )}
                    </div>
                )}
            </div>
        );
    }
}