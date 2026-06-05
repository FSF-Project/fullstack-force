import { CartItem, OrderHistoryEntry } from "./types";

const ORDERS_KEY = "order_history";

function readOrders(): OrderHistoryEntry[] {
  const raw = localStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveOrders(orders: OrderHistoryEntry[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrderHistory(): OrderHistoryEntry[] {
  return readOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addOrderToHistory(
  order: Omit<OrderHistoryEntry, "id" | "createdAt" | "status"> & { id?: string }
): OrderHistoryEntry {
  const newOrder: OrderHistoryEntry = {
    id: order.id ?? "ZAM-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "Nowe",
    ...order,
  };

  saveOrders([newOrder, ...readOrders()]);
  return newOrder;
}

export function mapCartToOrderItems(cart: CartItem[]) {
  return cart.map((item) => ({
    bookId: item.book.id,
    title: item.book.title,
    author: item.book.author,
    quantity: item.quantity,
    price: item.book.price,
  }));
}
