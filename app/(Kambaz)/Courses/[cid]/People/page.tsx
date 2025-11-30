"use client";
import { useParams } from "next/navigation";
import PeopleTable from "./Table";
import { useEffect, useState } from "react";
import * as client from "../../client";

export default function People() {
    const { cid } = useParams();
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
        try {
            if (!cid) return;
            const enrolledUsers = await client.findUsersForCourse(cid as string);
            console.log("people table " + JSON.stringify(enrolledUsers));
            
            setUsers(enrolledUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [cid]);
    
    return (
        <div id="wd-people">
            <h2>People</h2>
            <PeopleTable users={users} fetchUsers={fetchUsers} />
        </div>
    )
}