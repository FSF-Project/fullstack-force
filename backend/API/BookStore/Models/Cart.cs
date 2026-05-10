namespace BookStore.Models;

public class Cart
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public int Ilosc { get; set; }

    public Product? Product { get; set; }
}