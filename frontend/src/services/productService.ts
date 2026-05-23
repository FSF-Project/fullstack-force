import { Product, Category, CreateProductDto } from "./types";

const PRODUCTS_KEY = "mock_products";
const CATEGORIES_KEY = "mock_categories";

const SEED_CATEGORIES: Category[] = [
  { id: 1, nazwa: "Klasyka" },
  { id: 2, nazwa: "Fantasy" },
  { id: 3, nazwa: "Science Fiction" },
  { id: 4, nazwa: "Romans" },
  { id: 5, nazwa: "Dystopia" },
  { id: 6, nazwa: "Baśń filozoficzna" },
];

const SEED_PRODUCTS: Product[] = [
  { id: 1, nazwa: "Zbrodnia i kara", autor: "Fiodor Dostojewski", cena: 34.99, opis: "Klasyka literatury rosyjskiej.", ilosc: 10, categoryId: 1, category: SEED_CATEGORIES[0] },
  { id: 2, nazwa: "Władca Pierścieni", autor: "J.R.R. Tolkien", cena: 89.99, opis: "Epicka saga fantasy.", ilosc: 8, categoryId: 2, category: SEED_CATEGORIES[1] },
  { id: 3, nazwa: "Solaris", autor: "Stanisław Lem", cena: 29.99, opis: "Filozoficzna powieść science fiction.", ilosc: 15, categoryId: 3, category: SEED_CATEGORIES[2] },
  { id: 4, nazwa: "Duma i uprzedzenie", autor: "Jane Austen", cena: 27.99, opis: "Romantyczna powieść.", ilosc: 12, categoryId: 4, category: SEED_CATEGORIES[3] },
  { id: 5, nazwa: "Wiedźmin: Ostatnie życzenie", autor: "Andrzej Sapkowski", cena: 32.99, opis: "Zbiór opowiadań o Geralcie z Rivii.", ilosc: 20, categoryId: 2, category: SEED_CATEGORIES[1] },
  { id: 6, nazwa: "1984", autor: "George Orwell", cena: 24.99, opis: "Dystopijne arcydzieło.", ilosc: 18, categoryId: 5, category: SEED_CATEGORIES[4] },
  { id: 7, nazwa: "Mały Książę", autor: "Antoine de Saint-Exupéry", cena: 19.99, opis: "Poetycka opowieść.", ilosc: 25, categoryId: 6, category: SEED_CATEGORIES[5] },
  { id: 8, nazwa: "Proces", autor: "Franz Kafka", cena: 28.99, opis: "Absurdalna opowieść o Józefie K.", ilosc: 7, categoryId: 1, category: SEED_CATEGORIES[0] },
];

function getCategories(): Category[] {
  const raw = localStorage.getItem(CATEGORIES_KEY);
  if (!raw) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(SEED_CATEGORIES));
    return SEED_CATEGORIES;
  }
  return JSON.parse(raw);
}

function getProducts(): Product[] {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  return JSON.parse(raw);
}

function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function resolveCategory(categoryId: number, categories: Category[]): Category | undefined {
  return categories.find((c) => c.id === categoryId);
}

export function getAllProducts(): Product[] {
  return getProducts();
}

export function getProductById(id: number): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function createProduct(dto: CreateProductDto): Product {
  const products = getProducts();
  const categories = getCategories();
  const newProduct: Product = {
    id: Date.now(),
    ...dto,
    category: resolveCategory(dto.categoryId, categories),
  };
  saveProducts([...products, newProduct]);
  return newProduct;
}

export function updateProduct(id: number, dto: CreateProductDto): Product | undefined {
  const products = getProducts();
  const categories = getCategories();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  const updated: Product = {
    ...products[index],
    ...dto,
    category: resolveCategory(dto.categoryId, categories),
  };
  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function deleteProduct(id: number): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export { getCategories };
