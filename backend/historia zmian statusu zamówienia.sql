CREATE OR ALTER TRIGGER trg_OrderStatusHistory
ON [Order]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO OrderStatusHistory (order_Id, old_Status, new_status)
    SELECT
        d.Id,
        d.Status,
        i.Status
    FROM deleted d
    JOIN inserted i ON d.Id = i.Id
    WHERE d.Status <> i.Status;
END
GO
