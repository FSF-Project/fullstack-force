import { useEffect, useMemo, useState } from "react";
import { getAllBooks, getGenres, searchBooks } from "@/services/bookService";
import { Book } from "@/services/types";
import BookCard from "@/components/BookCard";
import BookDetail from "@/components/BookDetail";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const Catalog = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllBooks()
      .then((books) => {
        setAllBooks(books);
        setError(null);
      })
      .catch(() => {
        setError("Nie udalo sie pobrac ksiazek z backendu.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const genres = useMemo(() => getGenres(allBooks), [allBooks]);

  const filteredBooks = useMemo(() => {
    let result = query ? searchBooks(allBooks, query) : allBooks;
    if (activeGenre) {
      result = result.filter((b) => b.genre === activeGenre);
    }
    return result;
  }, [query, activeGenre, allBooks]);

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
      <main className="container py-8 space-y-8">
        <section className="text-center space-y-4 py-8">
          <h1 className="font-display text-5xl font-bold text-foreground">
            Odkryj swoją następną lekturę
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Przeglądaj naszą kolekcję klasyków i współczesnych bestsellerów.
          </p>
        </section>

        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj po tytule lub autorze..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge
              variant={activeGenre === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveGenre(null)}
            >
              Wszystkie
            </Badge>
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant={activeGenre === genre ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Ladowanie ksiazek...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nie znaleziono książek pasujących do wyszukiwania.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 Księgarnia. Wszystkie prawa zastrzeżone.
        </div>
      </footer>
    </div>
  );
};

export default Catalog;
