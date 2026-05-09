USE BookStore;
GO
CREATE PROCEDURE CreateOrder
    @user_id INT
AS
BEGIN
    INSERT INTO [Order]
    (user_id,status)
    VALUES
    (@user_id,'Nowe')
END
GO
