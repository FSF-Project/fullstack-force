CREATE DATABASE BookStore;
GO

USE BookStore;
GO

CREATE TABLE [User](
    id INT PRIMARY KEY IDENTITY(1,1),
    imie VARCHAR(50),
    nazwisko VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    haslo VARCHAR(255),
    rola VARCHAR(20) DEFAULT 'client'
);

CREATE TABLE Category(
    id INT PRIMARY KEY IDENTITY(1,1),
    nazwa VARCHAR(100)
);

CREATE TABLE Product(
    id INT PRIMARY KEY IDENTITY(1,1),
    nazwa VARCHAR(255),
    autor VARCHAR(255),
    cena DECIMAL(10,2),
    opis TEXT,
    ilosc INT,
    category_id INT,
    FOREIGN KEY(category_id)
    REFERENCES Category(id)
);

CREATE TABLE Cart(
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    product_id INT,
    ilosc INT,
    FOREIGN KEY(user_id) REFERENCES [User](id),
    FOREIGN KEY(product_id) REFERENCES Product(id)
);

CREATE TABLE [Order](
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    data_zamowienia DATETIME DEFAULT GETDATE(),
    status VARCHAR(50) DEFAULT 'Nowe',
    FOREIGN KEY(user_id)
    REFERENCES [User](id)
);

CREATE TABLE OrderItem(
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT,
    product_id INT,
    ilosc INT,
    cena DECIMAL(10,2),
    FOREIGN KEY(order_id) REFERENCES [Order](id),
    FOREIGN KEY(product_id) REFERENCES Product(id)
);

CREATE TABLE OrderStatusHistory(
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at DATETIME DEFAULT GETDATE()
);
