CREATE OR ALTER PROCEDURE sp_AddToCart
    @UserId INT,
    @ProductId INT,
    @Ilosc INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Ilosc <= 0
    BEGIN
        RAISERROR('Ilość musi być większa od 0', 16, 1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1 FROM Cart
        WHERE User_Id = @UserId AND Product_Id = @ProductId
    )
    BEGIN
        UPDATE Cart
        SET Ilosc = Ilosc + @Ilosc
        WHERE User_Id = @UserId AND Product_Id = @ProductId;
    END
    ELSE
    BEGIN
        INSERT INTO Cart(User_Id, Product_Id, Ilosc)
        VALUES (@UserId, @ProductId, @Ilosc);
    END
END
GO
