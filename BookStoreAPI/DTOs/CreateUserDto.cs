namespace BookStore.DTOs;

public class CreateUserDto
{
    public string Imie { get; set; } = string.Empty;

    public string Nazwisko { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Haslo { get; set; } = string.Empty;
}