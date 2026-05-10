namespace BookStore.Models;

public class Orders
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime DataZamowienia { get; set; }

    public string Status { get; set; } = "Nowe";
}