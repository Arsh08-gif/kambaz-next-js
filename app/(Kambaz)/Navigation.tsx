"use client"
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { usePathname } from "next/navigation";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
export default function KambazNavigation() {
    const pathname = usePathname();
    const links = [
        { label: "Dashboard", id: "wd-dashboard-link", path: "/Dashboard", icon: AiOutlineDashboard },
        { label: "Courses", id: "wd-courses-link", path: "/Dashboard", icon: LiaBookSolid },
        { label: "Calendar", id: "wd-calendar-link", path: "/Calendar", icon: IoCalendarOutline },
        { label: "Inbox", id: "wd-inbox-link", path: "/Inbox", icon: FaInbox },
        { label: "Labs", id: "wd-labs-link", path: "/Labs", icon: LiaCogSolid },
    ];

    return (
        <ListGroup id="wd-kambaz-navigation" style={{ width: 120 }}
            className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
            <ListGroupItem id="wd-neu-link" target="_blank" href="https://www.northeastern.edu/"
                action className="bg-black border-0 text-center">
                <img src="/Images/NEU.png" width="75px" /></ListGroupItem>
            <ListGroupItem as={Link} href="/Account"
                className={`text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
                <FaRegCircleUser
                    className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
                <br />
                Account
            </ListGroupItem>
            {links.map((link) => (
                <ListGroupItem key={link.id} as={Link} href={link.path}
                    className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
                    {link.icon({ className: "fs-1 text-danger" })}
                    <br />
                    {link.label}
                </ListGroupItem>
            ))}
        </ListGroup>

    );
}

