namespace BookStore.Models;

public class User
{
    public int Id { get; set; }

    public string Imie { get; set; } = string.Empty;

    public string Nazwisko { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Rola { get; set; } = "client";
}