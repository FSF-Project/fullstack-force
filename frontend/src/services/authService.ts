import API_URL from "@/api/client";
import { User, CreateUserDto, LoginDto } from "./types";

export type AuthResult = { user: User } | { error: string };

async function handleAuthResponse(res: Response): Promise<AuthResult> {
  if (!res.ok) {
    const message = await res.text();
    return { error: message || "Nie udalo sie polaczyc z API" };
  }

  return { user: await res.json() };
}

export async function register(dto: CreateUserDto): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    return handleAuthResponse(res);
  } catch {
    return { error: "Brak polaczenia z API" };
  }
}

export async function login(dto: LoginDto): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    return handleAuthResponse(res);
  } catch {
    return { error: "Brak polaczenia z API" };
  }
}
