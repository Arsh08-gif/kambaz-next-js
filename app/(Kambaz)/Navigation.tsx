import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FiClock } from "react-icons/fi";
import { FaInbox, FaRegCircleUser} from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { TbCreativeCommonsSa } from "react-icons/tb";
import { ImTv } from "react-icons/im";
import { ImLab } from "react-icons/im";
import Link from "next/link";
export default function KambazNavigation() {
    return (
        <ListGroup className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style={{ width: 110 }}
            id="wd-kambaz-navigation">
            <ListGroupItem className="bg-black border-0 text-center" as="a"
                target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
                <img src="/Images/NEU.png" width="75px" alt="Northeastern University" />
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Account" id="wd-account-link" className="text-white text-decoration-none">
                    <FaRegCircleUser className="fs-1 text-white" />
                    <br />
                    Account
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-white text-center">
                <Link href="/Dashboard" id="wd-dashboard-link" className="text-danger text-decoration-none">
                    <AiOutlineDashboard className="fs-1 text-danger" />
                    <br />
                    Dashboard
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Dashboard" id="wd-courses-link" className="text-white text-decoration-none">
                    <LiaBookSolid className="fs-1 text-danger" />
                    <br />
                    Courses
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Calendar" id="wd-calendar-link" className="text-white text-decoration-none">
                    <IoCalendarOutline className="fs-1 text-danger" />
                    <br />
                    Calendar
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Inbox" id="wd-inbox-link" className="text-white text-decoration-none">
                    <FaInbox className="fs-1 text-danger" />
                    <br />
                    Inbox
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Labs" id="wd-inbox-link" className="text-white text-decoration-none">
                    <ImLab className="fs-1 text-danger" />
                    <br />
                    Labs
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/History" id="wd-history-link" className="text-white text-decoration-none">
                    <FiClock className="fs-1 text-danger" />
                    <br />
                    History
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Commons" id="wd-commons-link" className="text-white text-decoration-none">
                    <TbCreativeCommonsSa className="fs-1 text-danger" />
                    <br />
                    Commons
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Studio" id="wd-studio-link" className="text-white text-decoration-none">
                    <ImTv  className="fs-1 text-danger" />
                    <br />
                    Studio
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Help" id="wd-help-link" className="text-white text-decoration-none">
                    <IoMdHelpCircleOutline  className="fs-1 text-danger" />
                    <br />
                    Help
                </Link>
            </ListGroupItem>
        </ListGroup>
    );
}

