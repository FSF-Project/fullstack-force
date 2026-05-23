import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import CartSheet from "@/components/CartSheet";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">Księgarnia</span>
        </Link>

        <nav className="hidden md:absolute md:left-1/2 md:-translate-x-1/2 md:flex items-center gap-6">
          <Link
            to="/katalog"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === "/katalog" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Katalog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <nav className="flex md:hidden items-center gap-4">
            <Link
              to="/katalog"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                pathname === "/katalog" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Katalog
            </Link>
          </nav>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Witaj, <span className="font-medium text-foreground">{user.imie}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-medium text-muted-foreground border border-border rounded-md px-3 py-1.5 transition-colors hover:text-foreground hover:border-foreground/30"
              >
                Wyloguj
              </button>
            </div>
          ) : (
            <Link
              to="/logowanie"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Zaloguj się
            </Link>
          )}
          <CartSheet />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
