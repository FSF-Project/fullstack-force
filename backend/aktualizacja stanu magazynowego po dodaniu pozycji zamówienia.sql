CREATE OR ALTER TRIGGER trg_UpdateStockAfterOrderItem
ON OrderItem
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.Ilosc = p.Ilosc - i.Ilosc
    FROM Product p
    INNER JOIN inserted i ON p.Id = i.Product_Id;
END
GO
