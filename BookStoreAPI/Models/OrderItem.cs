namespace BookStore.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public int Ilosc { get; set; }

    public decimal Cena { get; set; }
}