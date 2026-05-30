import { getProducts } from "@/api/products";
import { Book } from "./types";

interface ProductResponse {
  id: number;
  nazwa?: string;
  Nazwa?: string;
  autor?: string;
  Autor?: string;
  cena?: number;
  Cena?: number;
  ilosc?: number;
  Ilosc?: number;
  opis?: string | null;
  Opis?: string | null;
  category?: {
    nazwa?: string;
    Nazwa?: string;
  } | null;
  Category?: {
    nazwa?: string;
    Nazwa?: string;
  } | null;
}

const fallbackCoverUrl =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";

function mapProductToBook(product: ProductResponse): Book {
  const category = product.category ?? product.Category;

  return {
    id: String(product.id),
    title: product.nazwa ?? product.Nazwa ?? "Bez tytulu",
    author: product.autor ?? product.Autor ?? "Nieznany autor",
    price: Number(product.cena ?? product.Cena ?? 0),
    stock: Number(product.ilosc ?? product.Ilosc ?? 0),
    coverUrl: fallbackCoverUrl,
    description: product.opis ?? product.Opis ?? "Brak opisu.",
    genre: category?.nazwa ?? category?.Nazwa ?? "Bez kategorii",
    year: 2026,
    pages: 0,
    isbn: "-",
  };
}

export async function getAllBooks(): Promise<Book[]> {
  const products = (await getProducts()) as ProductResponse[];
  return products.map(mapProductToBook);
}

export function getBookById(books: Book[], id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getGenres(books: Book[]): string[] {
  return [...new Set(books.map((b) => b.genre))];
}

export function getBooksByGenre(books: Book[], genre: string): Book[] {
  return books.filter((b) => b.genre === genre);
}

export function searchBooks(books: Book[], query: string): Book[] {
  const q = query.toLowerCase();
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
  );
}
