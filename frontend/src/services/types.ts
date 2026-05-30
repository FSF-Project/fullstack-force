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
