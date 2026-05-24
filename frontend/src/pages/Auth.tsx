import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

type Mode = "login" | "register";

type FieldErrors = Partial<Record<"imie" | "nazwisko" | "email" | "haslo", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: typeof EMPTY_FORM, mode: Mode): FieldErrors {
  const errors: FieldErrors = {};

  if (mode === "register") {
    if (!form.imie.trim()) errors.imie = "Imię jest wymagane";
    if (!form.nazwisko.trim()) errors.nazwisko = "Nazwisko jest wymagane";
  }

  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Podaj poprawny adres email";

  if (form.haslo.length < 8) errors.haslo = "Hasło musi mieć co najmniej 8 znaków";

  return errors;
}

const EMPTY_FORM = { imie: "", nazwisko: "", email: "", haslo: "" };

const Auth = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    setServerError(null);
    if (submitted) setFieldErrors(validate(updated, mode));
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setServerError(null);
    setFieldErrors({});
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const errors = validate(form, mode);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const result =
      mode === "login"
        ? await login({ email: form.email.trim(), haslo: form.haslo })
        : await register({ imie: form.imie.trim(), nazwisko: form.nazwisko.trim(), email: form.email.trim(), haslo: form.haslo });
    setIsSubmitting(false);

    if ("error" in result) {
      setServerError(result.error);
    } else {
      navigate("/");
    }
  };

  const field = (name: keyof FieldErrors) =>
    fieldErrors[name] ? (
      <p className="text-xs text-destructive mt-0.5">{fieldErrors[name]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-display text-xl font-bold text-foreground">Księgarnia</span>
      </Link>

      <div className="w-full max-w-md border border-border rounded-xl p-8 bg-card">
        <div className="flex mb-6 gap-2">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 text-sm font-medium pb-2 border-b-2 transition-colors ${
              mode === "login"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Logowanie
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 text-sm font-medium pb-2 border-b-2 transition-colors ${
              mode === "register"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Rejestracja
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {mode === "register" && (
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm text-muted-foreground" htmlFor="imie">
                  Imię
                </label>
                <Input
                  id="imie"
                  name="imie"
                  type="text"
                  autoComplete="given-name"
                  value={form.imie}
                  onChange={handleChange}
                  placeholder="Jan"
                />
                {field("imie")}
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm text-muted-foreground" htmlFor="nazwisko">
                  Nazwisko
                </label>
                <Input
                  id="nazwisko"
                  name="nazwisko"
                  type="text"
                  autoComplete="family-name"
                  value={form.nazwisko}
                  onChange={handleChange}
                  placeholder="Kowalski"
                />
                {field("nazwisko")}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jan@example.com"
            />
            {field("email")}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground" htmlFor="haslo">
              Hasło
            </label>
            <Input
              id="haslo"
              name="haslo"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.haslo}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {field("haslo")}
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
          </Button>
        </form>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Nie masz konta?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-primary hover:underline font-medium"
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już konto?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-primary hover:underline font-medium"
              >
                Zaloguj się
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
