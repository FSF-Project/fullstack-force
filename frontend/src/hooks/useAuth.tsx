import { createContext, useContext, useState, ReactNode } from "react";
import { User, CreateUserDto, LoginDto } from "@/services/types";
import { register as mockRegister, login as mockLogin, AuthResult } from "@/services/authService";

const SESSION_KEY = "auth_user";

interface AuthContextValue {
  user: User | null;
  login: (dto: LoginDto) => AuthResult;
  register: (dto: CreateUserDto) => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSession(): User | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  function login(dto: LoginDto): AuthResult {
    const result = mockLogin(dto);
    if ("user" in result) {
      setUser(result.user);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
    }
    return result;
  }

  function register(dto: CreateUserDto): AuthResult {
    const result = mockRegister(dto);
    if ("user" in result) {
      setUser(result.user);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
    }
    return result;
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
