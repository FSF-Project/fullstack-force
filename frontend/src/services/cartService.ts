import { Book, CartItem } from "./types";

let cart: CartItem[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeToCart(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getCart(): CartItem[] {
  return [...cart];
}

export function getCartCount(): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  return cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
}

function maxQuantity(book: Book): number {
  return Math.max(0, book.stock);
}

export function addToCart(book: Book): boolean {
  const max = maxQuantity(book);
  if (max === 0) {
    return false;
  }

  const existing = cart.find((item) => item.book.id === book.id);
  if (existing) {
    if (existing.quantity >= max) {
      return false;
    }
    existing.quantity += 1;
  } else {
    cart.push({ book, quantity: 1 });
  }
  notify();
  return true;
}

export function removeFromCart(bookId: string) {
  cart = cart.filter((item) => item.book.id !== bookId);
  notify();
}

export function updateQuantity(bookId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(bookId);
    return;
  }
  const item = cart.find((i) => i.book.id === bookId);
  if (item) {
    item.quantity = Math.min(quantity, maxQuantity(item.book));
    notify();
  }
}

export function clearCart() {
  cart = [];
  notify();
}
