import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
            <div id="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/react.png" alt='course img' width={200} height={150} />
                        <div>
                            <h5> CS1234 React JS </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/html.png" alt='course img' width={200} height={150} />
                        <div>
                            <h5> CS1566 HTML </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/css.jpg" alt='course img' width={200} height={150} />
                        <div>
                            <h5> CS1345 CSS  </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/nodejs.png" alt='course img' width={200} height={150} />
                        <div>
                            <h5> CS1679 Node Js </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/databases.jpg" alt='course img' width={200} height={150} />
                        <div>
                            <h5> CS1799 Databases </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/js.png" alt='course img' width={200} height={150} />
                        <div>
                            <h5> CS1455 JavaScript </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/mongodb.png" alt='course img' width={200} height={150} />
                        <div>
                            <h5> CS1355 MongoDB </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

