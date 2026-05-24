import API_URL from "./client";

export async function getUsers() {
    const res = await fetch(`${API_URL}/api/users`);
    if (!res.ok) throw new Error("Błąd users");
    return res.json();
}