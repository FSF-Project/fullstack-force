CREATE OR ALTER PROCEDURE sp_CreateOrder
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY

        -- 1. Tworzenie zamówienia
        INSERT INTO [Order](User_Id, Data_Zamowienia, Status)
        VALUES (@UserId, GETDATE(), 'Nowe');

        DECLARE @OrderId INT = SCOPE_IDENTITY();

        -- 2. Pobranie koszyka
        DECLARE @Cart TABLE (
            ProductId INT,
            Ilosc INT
        );

        INSERT INTO @Cart
        SELECT Product_Id, Ilosc
        FROM Cart
        WHERE User_Id = @UserId;

        -- 3. Dodanie pozycji zamówienia
        INSERT INTO OrderItem(Order_Id, Product_Id, Ilosc, Cena)
        SELECT
            @OrderId,
            c.ProductId,
            c.Ilosc,
            p.Cena
        FROM @Cart c
        JOIN Product p ON p.Id = c.ProductId;

        -- 4. Aktualizacja magazynu
        UPDATE p
        SET p.Ilosc = p.Ilosc - c.Ilosc
        FROM Product p
        JOIN @Cart c ON p.Id = c.ProductId;

        -- 5. Czyszczenie koszyka
        DELETE FROM Cart WHERE User_Id = @UserId;

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        THROW;

    END CATCH
END
GO
