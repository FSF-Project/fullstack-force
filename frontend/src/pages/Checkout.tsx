import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { clearCart } from "@/services/cartService";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

const Field = ({
  label,
  col,
  children,
}: {
  label: string;
  col?: "full";
  children: React.ReactNode;
}) => (
  <div className={`flex flex-col gap-1.5 ${col === "full" ? "col-span-2" : ""}`}>
    <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {label}
    </label>
    {children}
  </div>
);

type FormData = {
  email: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  card: string;
  exp: string;
  cvc: string;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total } = useCart();
  const [step, setStep] = useState(1);
  const [orderNum] = useState(
    () => "ZAM-" + Math.random().toString(36).slice(2, 8).toUpperCase()
  );
  const [form, setForm] = useState<FormData>({
    email: "",
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "Polska",
    card: "",
    exp: "",
    cvc: "",
  });

  const update = (k: keyof FormData, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const shipping = total > 200 ? 0 : 15;
  const tax = +(total * 0.23).toFixed(2);
  const orderTotal = +(total + shipping + tax).toFixed(2);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const canContinue =
    step === 1
      ? !!(form.email && form.name && form.address && form.city && form.zip)
      : !!(form.card && form.exp && form.cvc);

  if (cart.length === 0 && step < 3) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
          <h1 className="font-display text-4xl font-normal">Koszyk jest pusty.</h1>
          <p className="text-muted-foreground">Dodaj kilka książek i wróć tutaj.</p>
          <Button onClick={() => navigate("/katalog")}>Przeglądaj katalog</Button>
        </main>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
          <p className="text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
            Zamówienie {orderNum}
          </p>
          <h1 className="font-display text-5xl font-normal leading-tight">
            Dziękujemy.
          </h1>
          <p className="max-w-[44ch] text-[17px] text-muted-foreground">
            Twoje książki są w drodze. Potwierdzenie zostało wysłane na{" "}
            {form.email || "Twój e-mail"}. Miłej lektury.
          </p>
          <Button
            size="lg"
            onClick={() => {
              clearCart();
              navigate("/");
            }}
          >
            Wróć na stronę główną
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pb-32 pt-14">
        <button
          className="mb-10 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć
        </button>

        <div className="grid gap-12 md:items-start md:grid-cols-[1.4fr_1fr] md:gap-20">
          <div>
            <div className="mb-9 flex items-center gap-4 text-[11px] uppercase tracking-[0.1em]">
              {(
                [
                  [1, "Dostawa"],
                  [2, "Płatność"],
                  [3, "Gotowe"],
                ] as [number, string][]
              ).map(([num, label], i) => {
                const active = step === num;
                const done = step > num;
                return (
                  <div key={num} className="flex items-center gap-2">
                    {i > 0 && (
                      <span className="h-px w-9 bg-border opacity-60" />
                    )}
                    <div
                      className={`flex items-center gap-2 ${active || done ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      <span
                        className={`flex h-[22px] w-[22px] items-center justify-center rounded-full border text-[10px] ${
                          active || done
                            ? "border-foreground bg-foreground text-background"
                            : "border-current"
                        }`}
                      >
                        {num}
                      </span>
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>

            {step === 1 && (
              <div>
                <h2 className="mb-7 font-display text-4xl font-normal tracking-tight">
                  Dokąd wysłać?
                </h2>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <Field label="E-mail" col="full">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="czytelnik@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Imię i nazwisko" col="full">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="Jan Kowalski"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Ulica i numer" col="full">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="ul. Kwiatowa 12/3"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                  </Field>
                  <Field label="Miasto">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="Warszawa"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </Field>
                  <Field label="Kod pocztowy">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="00-001"
                      value={form.zip}
                      onChange={(e) => update("zip", e.target.value)}
                    />
                  </Field>
                  <Field label="Kraj" col="full">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                    />
                  </Field>
                </div>
                <Button
                  size="lg"
                  className="mt-9"
                  disabled={!canContinue}
                  onClick={() => canContinue && setStep(2)}
                >
                  Przejdź do płatności →
                </Button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-7 font-display text-4xl font-normal tracking-tight">
                  Płatność i wybór metody. 
                </h2>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <Field label="Numer karty" col="full">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="1234 5678 9012 3456"
                      value={form.card}
                      onChange={(e) => update("card", e.target.value)}
                    />
                  </Field>
                  <Field label="Ważna do">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="MM/RR"
                      value={form.exp}
                      onChange={(e) => update("exp", e.target.value)}
                    />
                  </Field>
                  <Field label="CVC">
                    <input
                      className="border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                      placeholder="123"
                      value={form.cvc}
                      onChange={(e) => update("cvc", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="mt-9 flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(1)}
                  >
                    ← Wróć
                  </Button>
                  <Button
                    size="lg"
                    disabled={!canContinue}
                    onClick={() => canContinue && setStep(3)}
                  >
                    Złóż zamówienie · {orderTotal.toFixed(2)} zł
                  </Button>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-lg border border-border bg-card p-7">
            <p className="mb-5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Podsumowanie zamówienia · {itemCount} szt.
            </p>
            <div className="flex flex-col gap-4" style={{ maxHeight: 320, overflowY: "auto" }}>
              {cart.map((i) => (
                <div
                  key={i.book.id}
                  className="grid grid-cols-[54px_1fr_auto] items-start gap-3"
                >
                  <img
                    src={i.book.coverUrl}
                    alt={i.book.title}
                    className="h-20 w-[54px] rounded-sm object-cover"
                  />
                  <div>
                    <p className="font-display text-sm font-medium leading-tight">
                      {i.book.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Szt. {i.quantity} · {i.book.genre}
                    </p>
                  </div>
                  <span className="text-sm tabular-nums">
                    {(i.book.price * i.quantity).toFixed(2)} zł
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-border pt-5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Suma częściowa</span>
                <span>{total.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Dostawa</span>
                <span>{shipping === 0 ? "Bezpłatna" : `${shipping.toFixed(2)} zł`}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>VAT (23%)</span>
                <span>{tax.toFixed(2)} zł</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-[17px]">Łącznie</span>
                <span className="font-display text-[22px] font-medium tabular-nums">
                  {orderTotal.toFixed(2)} zł
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
