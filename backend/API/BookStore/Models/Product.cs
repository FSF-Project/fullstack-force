namespace BookStore.Models;

public class Product
{
    public int Id { get; set; }

    public string Nazwa { get; set; } = string.Empty;

    public string Autor { get; set; } = string.Empty;

    public decimal Cena { get; set; }

    public string? Opis { get; set; }

    public int Ilosc { get; set; }

    public int CategoryId { get; set; }

    public Category? Category { get; set; }
}
