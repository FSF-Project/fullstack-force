import { useEffect, useState } from "react";
import { getUsers } from "../api/users";

type User = {
    id: number;
    imie: string;
    nazwisko: string;
    email: string;
};

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getUsers().then(setUsers);
    }, []);

    return (
        <div>
            <h1>Users</h1>

            {users.map(u => (
                <div key={u.id}>
                    {u.imie} {u.nazwisko} - {u.email}
                </div>
            ))}
        </div>
    );
}