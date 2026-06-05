export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  coverUrl: string;
  description: string;
  genre: string;
  year: number;
  pages: number;
  isbn: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderHistoryItem {
  bookId: string;
  title: string;
  author: string;
  quantity: number;
  price: number;
}

export interface OrderHistoryEntry {
  id: string;
  createdAt: string;
  status: string;
  customerEmail: string;
  customerName: string;
  items: OrderHistoryItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: number;
  nazwa: string;
}

export interface Product {
  id: number;
  nazwa: string;
  autor: string;
  cena: number;
  opis?: string;
  ilosc: number;
  categoryId: number;
  category?: Category;
}

export interface CreateProductDto {
  nazwa: string;
  autor: string;
  cena: number;
  opis?: string;
  ilosc: number;
  categoryId: number;
}

export interface User {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  rola: string;
}

export interface CreateUserDto {
  imie: string;
  nazwisko: string;
  email: string;
  haslo: string;
}

export interface LoginDto {
  email: string;
  haslo: string;
}
