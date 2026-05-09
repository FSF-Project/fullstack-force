CREATE OR ALTER PROCEDURE sp_CheckStock
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Nazwa, Ilosc
    FROM Product
    WHERE Id = @ProductId;
END
GO
