import { useEffect, useMemo, useState } from "react";
import { getAllBooks, getBookById } from "@/services/bookService";
import { Book } from "@/services/types";
import BookDetail from "@/components/BookDetail";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeSection from "@/components/HomeSection";

const Index = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  useEffect(() => {
    getAllBooks()
      .then(setAllBooks)
      .catch(() => setAllBooks([]));
  }, []);

  const featuredBook = getBookById(allBooks, "3") ?? allBooks[0];
  const newArrivals = useMemo(
    () => [...allBooks].sort((a, b) => b.year - a.year).slice(0, 4),
    [allBooks]
  );
  const classics = useMemo(
    () => [...allBooks].sort((a, b) => a.year - b.year).slice(0, 4),
    [allBooks]
  );

  if (selectedBook) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <BookDetail book={selectedBook} onBack={() => setSelectedBook(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {featuredBook && <Hero book={featuredBook} onSelect={setSelectedBook} />}

      <HomeSection
        kicker="Nowości tego miesiąca"
        title="Świeże premiery."
        books={newArrivals}
        onSelect={setSelectedBook}
      />
      <HomeSection
        kicker="Polecane przez redakcję"
        title="Książki, które wciąż rekomendujemy."
        books={classics}
        onSelect={setSelectedBook}
      />

      <footer className="border-t border-border py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 Księgarnia. Wszystkie prawa zastrzeżone.
        </div>
      </footer>
    </div>
  );
};

export default Index;
