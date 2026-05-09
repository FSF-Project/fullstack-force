CREATE OR ALTER PROCEDURE sp_GetOrderDetails
    @OrderId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        o.Id AS OrderId,
        o.Status,
        o.Data_Zamowienia,
        p.Nazwa,
        oi.Ilosc,
        oi.Cena
    FROM [Order] o
    JOIN OrderItem oi ON o.Id = oi.Order_Id
    JOIN Product p ON p.Id = oi.Product_Id
    WHERE o.Id = @OrderId;
END
GO
