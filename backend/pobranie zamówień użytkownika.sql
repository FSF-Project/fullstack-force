CREATE OR ALTER PROCEDURE sp_GetOrdersByUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM [Order]
    WHERE User_Id = @UserId
    ORDER BY Data_Zamowienia DESC;
END
GO
