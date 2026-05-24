import API_URL from "./client";
import { Category, CreateProductDto, Product } from "@/services/types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Blad komunikacji z API");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`);
  return handleResponse<Product[]>(res);
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories`);
  return handleResponse<Category[]>(res);
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  return handleResponse<Product>(res);
}

export async function updateProduct(id: number, dto: CreateProductDto): Promise<void> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  await handleResponse<void>(res);
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
  });

  await handleResponse<void>(res);
}
