CREATE OR ALTER PROCEDURE sp_AddUser
    @Imie NVARCHAR(50),
    @Nazwisko NVARCHAR(50),
    @Email NVARCHAR(100),
    @Haslo NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [User] WHERE Email = @Email)
    BEGIN
        RAISERROR('Użytkownik już istnieje', 16, 1);
        RETURN;
    END

    INSERT INTO [User](Imie, Nazwisko, Email, Haslo, Rola)
    VALUES (@Imie, @Nazwisko, @Email, @Haslo, 'client');
END
GO
