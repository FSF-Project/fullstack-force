import { Book } from "@/services/types";
import { addToCart } from "@/services/cartService";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface HeroProps {
  book: Book;
  onSelect: (book: Book) => void;
}

const Hero = ({ book, onSelect }: HeroProps) => {
  const isOutOfStock = book.stock <= 0;

  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="container pt-[72px] pb-20">
        <div className="grid items-center gap-12 md:gap-20 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-7 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground before:block before:h-px before:w-7 before:bg-muted-foreground">
              Wybor redakcji - Numer 14
            </p>
            <h1 className="mb-7 font-display font-normal leading-[1.02] tracking-[-0.025em] text-foreground text-[clamp(37px,4.7vw,70px)]">
              Ksiazki, ktorymi <em className="italic text-primary">jestesmy zauroczeni</em> w tym miesiacu.
            </h1>
            <p className="mb-9 max-w-[44ch] text-lg leading-[1.55] text-muted-foreground">{book.description}</p>
            <div className="mb-9 flex flex-wrap gap-x-8 gap-y-4 text-[13px] text-muted-foreground">
              <span>
                Autor
                <strong className="mt-0.5 block text-sm font-medium text-foreground">{book.author}</strong>
              </span>
              <span>
                Stron
                <strong className="mt-0.5 block text-sm font-medium text-foreground">{book.pages}</strong>
              </span>
              <span>
                Wydano
                <strong className="mt-0.5 block text-sm font-medium text-foreground">{book.year}</strong>
              </span>
              <span>
                Dostepne
                <strong className="mt-0.5 block text-sm font-medium text-foreground">{book.stock}</strong>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => onSelect(book)}>
                Czytaj wiecej
              </Button>
              <Button size="lg" variant="outline" disabled={isOutOfStock} onClick={() => addToCart(book)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isOutOfStock ? "Brak w magazynie" : `Dodaj do koszyka - ${book.price.toFixed(2)} zl`}
              </Button>
            </div>
          </div>

          <div className="group flex justify-center [perspective:1800px]">
            <div
              className="relative h-[460px] w-[307px] max-w-full cursor-pointer overflow-hidden rounded-sm shadow-[0_70px_110px_-25px_rgba(0,0,0,0.55),_0_30px_50px_-15px_rgba(0,0,0,0.4),_0_10px_20px_-8px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out -rotate-3 group-hover:rotate-0 group-hover:-translate-y-1.5"
              onClick={() => onSelect(book)}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-2 bg-gradient-to-l from-black/30 to-transparent" />
              <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-7 pt-24">
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/60">{book.genre}</p>
                <h2 className="font-display text-xl font-semibold leading-tight text-white">{book.title}</h2>
                <p className="mt-2 text-sm text-white/70">{book.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
