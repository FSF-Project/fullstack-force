import { User, CreateUserDto, LoginDto } from "./types";

type StoredUser = User & { haslo: string };

const USERS_KEY = "mock_users";

function getStoredUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser({ haslo: _haslo, ...user }: StoredUser): User {
  return user;
}

export type AuthResult = { user: User } | { error: string };

export function register(dto: CreateUserDto): AuthResult {
  const users = getStoredUsers();

  if (users.some((u) => u.email === dto.email)) {
    return { error: "Email już istnieje" };
  }

  const newUser: StoredUser = {
    id: Date.now(),
    imie: dto.imie,
    nazwisko: dto.nazwisko,
    email: dto.email,
    rola: "client",
    haslo: dto.haslo,
  };

  saveStoredUsers([...users, newUser]);

  return { user: toPublicUser(newUser) };
}

export function login(dto: LoginDto): AuthResult {
  const users = getStoredUsers();
  const found = users.find((u) => u.email === dto.email && u.haslo === dto.haslo);

  if (!found) {
    return { error: "Nieprawidłowy email lub hasło" };
  }

  return { user: toPublicUser(found) };
}
