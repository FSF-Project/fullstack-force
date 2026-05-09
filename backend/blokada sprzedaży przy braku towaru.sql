CREATE OR ALTER TRIGGER trg_PreventNegativeStock
ON OrderItem
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN Product p ON p.Id = i.Product_Id
        WHERE p.Ilosc < i.Ilosc
    )
    BEGIN
        RAISERROR('Brak wystarczającej ilości produktu w magazynie', 16, 1);
        RETURN;
    END

    INSERT INTO OrderItem(Order_Id, Product_Id, Ilosc, Cena)
    SELECT Order_Id, Product_Id, Ilosc, Cena
    FROM inserted;
END
GO
