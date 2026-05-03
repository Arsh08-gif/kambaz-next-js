"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Card, Alert, Button, Badge } from "react-bootstrap";
import { CheckCircle, XCircle } from "lucide-react";
import * as client from "../../../../../client";

export default function QuizResults() {
    const { cid, qid, attemptId } = useParams();
    const router = useRouter();
    
    const [attempt, setAttempt] = useState<any>(null);
    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [attemptId]);

    const fetchResults = async () => {
        console.log("inside fetch results");
        
        try {
            const [attemptData, quizData, questionsData] = await Promise.all([
                client.getAttemptById(attemptId as string),
                client.findQuizById(qid as string),
                client.findQuestionsForQuiz(qid as string)
            ]);
            console.log("attempt data " + JSON.stringify(attemptData));
            
            setAttempt(attemptData);
            setQuiz(quizData);
            setQuestions(questionsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching results:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <Container className="mt-4">Loading results...</Container>;
    }

    const percentage = ((attempt.score / quiz.points) * 100).toFixed(1);
    const canRetake = quiz.multipleAttempts && 
                      attempt.attemptNumber < quiz.numberOfAttempts;

    return (
        <Container className="mt-4">
            {/* Score Summary */}
            <Card className="mb-4">
                <Card.Body>
                    <h2>{quiz.title} - Results</h2>
                    <div className="row text-center mt-4">
                        <div className="col-md-4">
                            <h3 className="text-primary">{attempt.score}/{quiz.points}</h3>
                            <p className="text-muted">Score</p>
                        </div>
                        <div className="col-md-4">
                            <h3 className="text-success">{percentage}%</h3>
                            <p className="text-muted">Percentage</p>
                        </div>
                        <div className="col-md-4">
                            <h3 className="text-info">Attempt {attempt.attemptNumber}</h3>
                            <p className="text-muted">
                                {new Date(attempt.submittedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <h4 className="mb-3">Question Results</h4>
            {questions.map((question, index) => {
                const answer = attempt.answers.find(
                    (a: any) => a.questionId === question._id
                );
                
                return (
                    <Card 
                        key={question._id} 
                        className={`mb-3 border-${answer?.isCorrect ? 'success' : 'danger'}`}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <h5 className="d-flex align-items-center">
                                    {answer?.isCorrect ? (
                                        <CheckCircle className="text-success me-2" size={24} />
                                    ) : (
                                        <XCircle className="text-danger me-2" size={24} />
                                    )}
                                    Question {index + 1}
                                </h5>
                                <Badge bg={answer?.isCorrect ? 'success' : 'danger'}>
                                    {answer?.pointsEarned}/{question.points} pts
                                </Badge>
                            </div>

                            <p className="mt-3 fw-bold">{question.question}</p>

                            <div className="mt-3">
                                <div className="mb-2">
                                    <strong>Your Answer: </strong>
                                    <span className={answer?.isCorrect ? 'text-success' : 'text-danger'}>
                                        {answer?.answer || "No answer"}
                                    </span>
                                </div>

                                {!answer?.isCorrect && (
                                    <div>
                                        <strong>Correct Answer: </strong>
                                        <span className="text-success">
                                            {question.type === "Multiple Choice" 
                                                ? question.choices.find((c: any) => c.correct)?.text
                                                : question.correctAnswer
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4 mb-5">
                <Button 
                    variant="secondary"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
                >
                    Back to Quizzes
                </Button>

                {canRetake && (
                    <Button 
                        variant="primary"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
                    >
                        Take Quiz Again
                    </Button>
                )}
            </div>
        </Container>
    );
}