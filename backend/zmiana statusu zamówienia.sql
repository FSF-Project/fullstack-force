CREATE OR ALTER PROCEDURE sp_UpdateOrderStatus
    @OrderId INT,
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [Order]
    SET Status = @Status
    WHERE Id = @OrderId;
END
GO
