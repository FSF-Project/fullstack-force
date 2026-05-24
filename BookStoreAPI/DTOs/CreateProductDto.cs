namespace BookStore.DTOs;

public class CreateProductDto
{
    public string Nazwa { get; set; } = string.Empty;

    public string Autor { get; set; } = string.Empty;

    public decimal Cena { get; set; }

    public string Opis { get; set; } = string.Empty;

    public int Ilosc { get; set; }

    public int CategoryId { get; set; }
}