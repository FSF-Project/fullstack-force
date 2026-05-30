import { Book } from "@/services/types";
import { addToCart } from "@/services/cartService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, BookOpen } from "lucide-react";

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

const BookDetail = ({ book, onBack }: BookDetailProps) => {
  const isOutOfStock = book.stock <= 0;

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Wróć do listy
      </Button>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="aspect-[2/3] overflow-hidden rounded-lg border border-border">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {book.genre}
            </Badge>
            <h1 className="font-display text-4xl font-bold text-foreground">
              {book.title}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">{book.author}</p>
          </div>

          <p className="text-base leading-relaxed text-foreground/80">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {book.pages} stron
            </span>
            <span>Rok wydania: {book.year}</span>
            <span>ISBN: {book.isbn}</span>
            <span>Dostepne: {book.stock}</span>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <span className="font-display text-3xl font-bold text-primary">
              {book.price.toFixed(2)} zł
            </span>
            <Button size="lg" onClick={() => addToCart(book)} disabled={isOutOfStock} className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Brak w magazynie" : "Dodaj do koszyka"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
