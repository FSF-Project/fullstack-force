USE BookStore;
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

/* =========================
   USUWANIE STARYCH OBIEKTÓW
========================= */

DROP TABLE IF EXISTS Cart;
DROP TABLE IF EXISTS OrderStatusHistory;
DROP TABLE IF EXISTS OrderItem;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Users;
GO

DROP PROCEDURE IF EXISTS sp_AddToCart;
DROP PROCEDURE IF EXISTS sp_AddUser;
DROP PROCEDURE IF EXISTS sp_CheckStock;
DROP PROCEDURE IF EXISTS sp_CreateOrder;
DROP PROCEDURE IF EXISTS sp_GetCartByUser;
DROP PROCEDURE IF EXISTS sp_GetOrdersByUser;
DROP PROCEDURE IF EXISTS sp_UpdateOrderStatus;
GO

/* =========================
   TABELE
========================= */

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Imie VARCHAR(50) NOT NULL,
    Nazwisko VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Haslo VARCHAR(255) NOT NULL,
    Rola VARCHAR(20) NOT NULL DEFAULT 'client'
);
GO

CREATE TABLE Category (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nazwa VARCHAR(100) NOT NULL
);
GO

CREATE TABLE Product (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nazwa VARCHAR(255) NOT NULL,
    Autor VARCHAR(255) NOT NULL,
    Cena DECIMAL(10,2) NOT NULL,
    Opis NVARCHAR(MAX) NULL,
    Ilosc INT NOT NULL,
    CategoryId INT NOT NULL,

    CONSTRAINT FK_Product_Category
        FOREIGN KEY (CategoryId)
        REFERENCES Category(Id),

    CONSTRAINT CHK_Product_Ilosc
        CHECK (Ilosc >= 0),

    CONSTRAINT CHK_Product_Cena
        CHECK (Cena >= 0)
);
GO

CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    DataZamowienia DATETIME NOT NULL DEFAULT GETDATE(),
    Status VARCHAR(50) NOT NULL DEFAULT 'Nowe',

    CONSTRAINT FK_Orders_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(Id)
);
GO

CREATE TABLE OrderItem (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Ilosc INT NOT NULL,
    Cena DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_OrderItem_Order
        FOREIGN KEY (OrderId)
        REFERENCES Orders(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_OrderItem_Product
        FOREIGN KEY (ProductId)
        REFERENCES Product(Id),

    CONSTRAINT CHK_OrderItem_Ilosc
        CHECK (Ilosc > 0)
);
GO

CREATE TABLE OrderStatusHistory (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    OldStatus VARCHAR(50) NULL,
    NewStatus VARCHAR(50) NOT NULL,
    ChangedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_OrderStatusHistory_Order
        FOREIGN KEY (OrderId)
        REFERENCES Orders(Id)
        ON DELETE CASCADE
);
GO

CREATE TABLE Cart (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    Ilosc INT NOT NULL,

    CONSTRAINT FK_Cart_User
        FOREIGN KEY (UserId)
        REFERENCES Users(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_Cart_Product
        FOREIGN KEY (ProductId)
        REFERENCES Product(Id),

    CONSTRAINT UQ_Cart_User_Product
        UNIQUE(UserId, ProductId),

    CONSTRAINT CHK_Cart_Ilosc
        CHECK (Ilosc > 0)
);
GO

/* =========================
   INDEKSY
========================= */

CREATE INDEX IX_Cart_UserId
ON Cart(UserId);

CREATE INDEX IX_Orders_UserId
ON Orders(UserId);

CREATE INDEX IX_Product_CategoryId
ON Product(CategoryId);
GO

/* =========================
   PROCEDURY
========================= */

CREATE PROCEDURE sp_AddUser
    @Imie VARCHAR(50),
    @Nazwisko VARCHAR(50),
    @Email VARCHAR(100),
    @Haslo VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM Users
        WHERE Email = @Email
    )
    BEGIN
        RAISERROR('Użytkownik już istnieje',16,1);
        RETURN;
    END

    INSERT INTO Users
    (
        Imie,
        Nazwisko,
        Email,
        Haslo,
        Rola
    )
    VALUES
    (
        @Imie,
        @Nazwisko,
        @Email,
        @Haslo,
        'client'
    );
END;
GO

/* ========================= */

CREATE PROCEDURE sp_AddToCart
    @UserId INT,
    @ProductId INT,
    @Ilosc INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Ilosc <= 0
    BEGIN
        RAISERROR('Ilość musi być większa od 0',16,1);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM Product
        WHERE Id = @ProductId
    )
    BEGIN
        RAISERROR('Produkt nie istnieje',16,1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM Cart
        WHERE UserId = @UserId
        AND ProductId = @ProductId
    )
    BEGIN
        UPDATE Cart
        SET Ilosc = Ilosc + @Ilosc
        WHERE UserId = @UserId
        AND ProductId = @ProductId;
    END
    ELSE
    BEGIN
        INSERT INTO Cart
        (
            UserId,
            ProductId,
            Ilosc
        )
        VALUES
        (
            @UserId,
            @ProductId,
            @Ilosc
        );
    END
END;
GO

/* ========================= */

CREATE PROCEDURE sp_CheckStock
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Nazwa,
        Ilosc
    FROM Product
    WHERE Id = @ProductId;
END;
GO

/* ========================= */

CREATE PROCEDURE sp_GetCartByUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        c.Id,
        c.UserId,
        c.ProductId,
        c.Ilosc,
        p.Nazwa,
        p.Cena
    FROM Cart c
    JOIN Product p
        ON p.Id = c.ProductId
    WHERE c.UserId = @UserId;
END;
GO

/* ========================= */

CREATE PROCEDURE sp_GetOrdersByUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Orders
    WHERE UserId = @UserId
    ORDER BY DataZamowienia DESC;
END;
GO

/* ========================= */

CREATE PROCEDURE sp_CreateOrder
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1
            FROM Cart
            WHERE UserId = @UserId
        )
        BEGIN
            RAISERROR('Koszyk jest pusty',16,1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DECLARE @Cart TABLE
        (
            ProductId INT,
            Ilosc INT
        );

        INSERT INTO @Cart
        SELECT
            ProductId,
            Ilosc
        FROM Cart
        WHERE UserId = @UserId;

        IF EXISTS (
            SELECT 1
            FROM Product p
            JOIN @Cart c
                ON p.Id = c.ProductId
            WHERE p.Ilosc < c.Ilosc
        )
        BEGIN
            RAISERROR('Brak wystarczającej ilości produktu',16,1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        INSERT INTO Orders
        (
            UserId,
            DataZamowienia,
            Status
        )
        VALUES
        (
            @UserId,
            GETDATE(),
            'Nowe'
        );

        DECLARE @OrderId INT = SCOPE_IDENTITY();

        INSERT INTO OrderItem
        (
            OrderId,
            ProductId,
            Ilosc,
            Cena
        )
        SELECT
            @OrderId,
            c.ProductId,
            c.Ilosc,
            p.Cena
        FROM @Cart c
        JOIN Product p
            ON p.Id = c.ProductId;

        UPDATE p
        SET p.Ilosc = p.Ilosc - c.Ilosc
        FROM Product p
        JOIN @Cart c
            ON p.Id = c.ProductId;

        DELETE FROM Cart
        WHERE UserId = @UserId;

        COMMIT TRANSACTION;

        SELECT @OrderId AS OrderId;

    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        THROW;

    END CATCH
END;
GO

/* ========================= */

CREATE PROCEDURE sp_UpdateOrderStatus
    @OrderId INT,
    @Status VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OldStatus VARCHAR(50);

    SELECT @OldStatus = Status
    FROM Orders
    WHERE Id = @OrderId;

    UPDATE Orders
    SET Status = @Status
    WHERE Id = @OrderId;

    INSERT INTO OrderStatusHistory
    (
        OrderId,
        OldStatus,
        NewStatus
    )
    VALUES
    (
        @OrderId,
        @OldStatus,
        @Status
    );
END;
GO