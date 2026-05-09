CREATE OR ALTER PROCEDURE sp_GetCartByUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        c.Id,
        c.User_Id,
        c.Product_Id,
        c.Ilosc,
        p.Nazwa,
        p.Cena
    FROM Cart c
    JOIN Product p ON p.Id = c.Product_Id
    WHERE c.User_Id = @UserId;
END
GO
