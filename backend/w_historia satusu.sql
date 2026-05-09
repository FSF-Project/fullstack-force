USE BookStore;
GO
CREATE TRIGGER trg_OrderStatusHistory
ON [Order]
AFTER UPDATE
AS
BEGIN
    INSERT INTO OrderStatusHistory
    (
        order_id,
        old_status,
        new_status
    )
    SELECT
        d.id,
        d.status,
        i.status
    FROM deleted d
    JOIN inserted i
    ON d.id = i.id
    WHERE d.status <> i.status
END
GO
