import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "@/services/productService";
import { Product, Category, CreateProductDto } from "@/services/types";

const EMPTY_FORM: CreateProductDto = {
  nazwa: "",
  autor: "",
  cena: 0,
  opis: "",
  ilosc: 0,
  categoryId: 0,
};

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CreateProductDto>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductDto, string>>>({});

  useEffect(() => {
    if (!user) {
      navigate("/logowanie");
      return;
    }
    setProducts(getAllProducts());
    setCategories(getCategories());
  }, [user, navigate]);

  const validate = (data: CreateProductDto) => {
    const e: Partial<Record<keyof CreateProductDto, string>> = {};
    if (!data.nazwa.trim()) e.nazwa = "Nazwa jest wymagana";
    if (!data.autor.trim()) e.autor = "Autor jest wymagany";
    if (data.cena <= 0) e.cena = "Cena musi być większa od 0";
    if (data.ilosc < 0) e.ilosc = "Ilość nie może być ujemna";
    if (!data.categoryId) e.categoryId = "Wybierz kategorię";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "cena" || name === "ilosc" || name === "categoryId" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? 0 });
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      nazwa: product.nazwa,
      autor: product.autor,
      cena: product.cena,
      opis: product.opis ?? "",
      ilosc: product.ilosc,
      categoryId: product.categoryId,
    });
    setEditingId(product.id);
    setErrors({});
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (editingId !== null) {
      updateProduct(editingId, form);
    } else {
      createProduct(form);
    }
    setProducts(getAllProducts());
    handleClose();
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setProducts(getAllProducts());
  };

  const fieldError = (name: keyof CreateProductDto) =>
    errors[name] ? <p className="text-xs text-destructive mt-0.5">{errors[name]}</p> : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Zarządzanie książkami</h1>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Dodaj książkę
          </Button>
        </div>

        {showForm && (
          <div className="border border-border rounded-xl p-6 mb-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {editingId !== null ? "Edytuj książkę" : "Nowa książka"}
              </h2>
              <button type="button" onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground" htmlFor="nazwa">Nazwa</label>
                  <Input id="nazwa" name="nazwa" value={form.nazwa} onChange={handleChange} placeholder="Tytuł książki" />
                  {fieldError("nazwa")}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground" htmlFor="autor">Autor</label>
                  <Input id="autor" name="autor" value={form.autor} onChange={handleChange} placeholder="Imię i nazwisko autora" />
                  {fieldError("autor")}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground" htmlFor="cena">Cena (zł)</label>
                  <Input id="cena" name="cena" type="number" min="0" step="0.01" value={form.cena} onChange={handleChange} />
                  {fieldError("cena")}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground" htmlFor="ilosc">Ilość w magazynie</label>
                  <Input id="ilosc" name="ilosc" type="number" min="0" value={form.ilosc} onChange={handleChange} />
                  {fieldError("ilosc")}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground" htmlFor="categoryId">Kategoria</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value={0} disabled>Wybierz kategorię</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nazwa}</option>
                    ))}
                  </select>
                  {fieldError("categoryId")}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm text-muted-foreground" htmlFor="opis">Opis</label>
                  <textarea
                    id="opis"
                    name="opis"
                    value={form.opis}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Krótki opis książki (opcjonalnie)"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button type="submit">
                  {editingId !== null ? "Zapisz zmiany" : "Dodaj książkę"}
                </Button>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Anuluj
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nazwa</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Autor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kategoria</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Cena</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ilość</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    Brak książek
                  </td>
                </tr>
              )}
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">{product.nazwa}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.autor}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.category?.nazwa ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-foreground">{product.cena.toFixed(2)} zł</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{product.ilosc}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Admin;
