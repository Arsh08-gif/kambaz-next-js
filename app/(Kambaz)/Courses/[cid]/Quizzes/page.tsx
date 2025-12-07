"use client"
import "./style.css";
import { Button, Dropdown, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaBan, FaPlus } from "react-icons/fa6";
import * as client from "../../client";
import { IoMdSearch } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FaCheckCircle } from "react-icons/fa";
import { Alert } from "react-bootstrap";

export default function Quizzes() {
    const { cid } = useParams();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [deleteAlert, setDeleteAlert] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    //const {assignments} = db
    const isFaculty = currentUser?.role === "FACULTY";
    const isStudent = currentUser?.role === "STUDENT";
    console.log("cid assignment: " + cid)
    useEffect(() => {
        fetchQuizzes();
    }, [cid]);
    const fetchQuizzes = async () => {
        try {
            const fetchedQuizzes = await client.findQuizzesForCourse(cid as string);
            console.log("fetched quizzes " + JSON.stringify(fetchQuizzes));

            setQuizzes(fetchedQuizzes);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return `${d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })} at ${d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;
    };

    const handleTogglePublish = async (quiz: any) => {
        try {
            const updatedQuiz = await client.updateQuiz({
                ...quiz,
                published: !quiz.published
            });
            setQuizzes(quizzes.map(q => q._id === quiz._id ? updatedQuiz : q));
        } catch (error) {
            console.error("Error toggling publish status:", error);
        }
    };

    const handleAddQuiz = async () => {
        try {
            // Create a new quiz with default values
            const newQuiz = {
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
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
                availableDate: new Date().toISOString(),
                availableUntilDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
                numberOfQuestions: 0,
                published: false
            };

            const createdQuiz = await client.createQuiz(cid as string, newQuiz);
            console.log("created quiz " + JSON.stringify(createdQuiz));

            //router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}/edit`);

            // Alternative: Navigate to Quiz Details screen (read-only view)
            router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}`);

        } catch (error) {
            console.error("Error creating quiz:", error);
            alert("Error creating quiz");
        }
    };

    const handleEditQuiz = (quizId: string) => {
        router.push(`/Courses/${cid}/Quizzes/${quizId}/edit`);
    };

    const handleDeleteQuiz = async (quizId: string) => {
        // if (window.confirm("Are you sure you want to delete this quiz?")) {
        //     try {
        //         await client.deleteQuiz(quizId);
        //         setQuizzes(quizzes.filter(q => q._id !== quizId));
        //     } catch (error) {
        //         console.error("Error deleting quiz:", error);
        //     }
        // }
        try {
            await client.deleteQuiz(quizId);
            setQuizzes(quizzes.filter(q => q._id !== quizId));
            setDeleteAlert(null);
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    const getAvailabilityStatus = (quiz: any) => {
        const now = new Date();
        const availableDate = new Date(quiz.availableDate);
        const availableUntilDate = new Date(quiz.availableUntilDate);

        if (now < availableDate) {
            return `Not available until ${availableDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })} at ${availableDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}`;
        } else if (now >= availableDate && now <= availableUntilDate) {
            return "Available";
        } else {
            return "Closed";
        }
    };

    const getLastAttemptScore = (quizId: string) => {
        // This would fetch from quiz attempts
        // For now, returning placeholder
        return null; // Replace with actual API call
    };

    // const displayQuizzes = isStudent
    //     ? quizzes.filter(q => q.published)
    //     : quizzes;

    const displayQuizzes = (isStudent
        ? quizzes.filter(q => q.published)
        : quizzes)
        .filter((quiz) =>
            quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.availableDate).getTime();
            const dateB = new Date(b.availableDate).getTime();
            return dateA - dateB;
        });

    return (
        <div id="wd-assignments">
            {deleteAlert && (
                <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                    <span>Are you sure you want to delete this quiz?</span>
                    <div>
                        <Button
                            variant="danger"
                            size="sm"
                            className="me-2"
                            onClick={() => handleDeleteQuiz(deleteAlert)}
                        >
                            Yes, Delete
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setDeleteAlert(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                </Alert>
            )}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="input-group" style={{ maxWidth: "300px" }}>
                    <span className="input-group-text">
                        <IoMdSearch />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for Quiz"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={(e) => e.target.style.boxShadow = 'none'}
                    />
                </div>

                <div>
                    {isFaculty && (
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={handleAddQuiz}
                            id="wd-add-assignment-btn"
                        >
                            <FaPlus className="me-2 position-relative" style={{ bottom: "1px" }} />
                            Quiz
                        </Button>
                    )}
                </div>

            </div>

            <ListGroup className="rounded-0 m-5" id="wd-modules">
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> Quizzes
                    </div>
                    <ListGroup className="rounded-0">
                        {displayQuizzes.length === 0 ? (
                            <ListGroupItem className="p-3 text-center text-muted">
                                {/* No quizzes available. Click  (+ Quiz) to add quizzes. */}
                                {searchTerm
                                    ? `No quizzes found`
                                    : "No quizzes available. Click (+ Quiz) to add quizzes."
                                }
                            </ListGroupItem>
                        ) : (
                            displayQuizzes.map((quiz) => {
                                const availabilityStatus = getAvailabilityStatus(quiz);
                                const lastScore = isStudent ? getLastAttemptScore(quiz._id) : null;

                                return (
                                    <ListGroupItem
                                        key={quiz._id}
                                        className="p-3 ps-1 border-start-0 border-end-0"
                                    >
                                        <div className="d-flex align-items-start">
                                            <BsGripVertical className="me-2 fs-3" />
                                            <LuNotebookPen className="text-success me-3 fs-4" />

                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <a
                                                            href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                                                            className="text-decoration-none text-dark fw-bold"
                                                        >
                                                            {quiz.title}
                                                        </a>

                                                        <div className="mt-2">
                                                            <span className={
                                                                availabilityStatus === "Closed" ? "text-danger fw-bold" :
                                                                    availabilityStatus === "Available" ? "text-success fw-bold" :
                                                                        "fw-bold"
                                                            }>
                                                                {availabilityStatus}
                                                            </span>
                                                            {!availabilityStatus.startsWith("Closed") && (
                                                                <>
                                                                    {" | "}
                                                                    <span className="fw-bold">Due</span> {formatDate(quiz.dueDate)}
                                                                </>
                                                            )}
                                                            {" | "}{quiz.points} pts
                                                            {" | "}{quiz.numberOfQuestions} Questions
                                                            {isStudent && lastScore !== null && (
                                                                <> | <span className="fw-bold">Score:</span> {lastScore}</>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2">
                                                        {isFaculty && (
                                                            <>
                                                                {/* Publish/Unpublish Toggle */}
                                                                <button
                                                                    onClick={() => handleTogglePublish(quiz)}
                                                                    className="btn btn-link text-decoration-none p-0"
                                                                    title={quiz.published ? "Published" : "Unpublished"}
                                                                >
                                                                    {quiz.published ? (
                                                                        <FaCheckCircle className="text-success fs-5" />
                                                                    ) : (
                                                                        <FaBan className="text-danger fs-5" />
                                                                    )}
                                                                </button>

                                                                {/* Context Menu */}
                                                                <Dropdown>
                                                                    <Dropdown.Toggle
                                                                        variant="link"
                                                                        className="text-dark p-0 border-0"
                                                                        id={`dropdown-${quiz._id}`}
                                                                    >
                                                                        <IoEllipsisVertical className="fs-4" />
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item
                                                                            onClick={() => handleEditQuiz(quiz._id)}
                                                                        >
                                                                            Edit
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item
                                                                            // onClick={() => handleDeleteQuiz(quiz._id)}
                                                                            onClick={() => setDeleteAlert(quiz._id)}
                                                                            className="text-danger"
                                                                        >
                                                                            Delete
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item
                                                                            onClick={() => handleTogglePublish(quiz)}
                                                                        >
                                                                            {quiz.published ? "Unpublish" : "Publish"}
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                );
                            })
                        )}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div >
    );
}

