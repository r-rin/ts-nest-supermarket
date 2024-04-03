/*
    This a setup to create a tables in your own database.
    Create a file .env to store configuration variables
    such as database credentials.

    Your .env file should include:
      DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

    How to run:
    > mysql -u your_user -p < path/to/sql_script.sql
 */

DROP DATABASE IF EXISTS Supermarket;
SET GLOBAL event_scheduler = ON;

CREATE DATABASE IF NOT EXISTS Supermarket;
USE Supermarket;

CREATE TABLE IF NOT EXISTS Global_Variables
(
    variable VARCHAR(50) PRIMARY KEY NOT NULL,
    value    TEXT                    NOT NULL
);

INSERT INTO Global_Variables (variable, value) VALUES ('vat', '0.2');
-- INSERT INTO Global_Variables (variable, value) VALUES ('sale_percent', '0.8');

CREATE TABLE IF NOT EXISTS Employee
(
    employee_id                 VARCHAR(10) PRIMARY KEY NOT NULL,
    employee_surname            VARCHAR(50)             NOT NULL,
    employee_name               VARCHAR(50)             NOT NULL,
    employee_patronymic         VARCHAR(50)             NULL,
    employee_role               VARCHAR(10)             NOT NULL,
    employee_salary             DECIMAL(13, 4)          NOT NULL,
    employee_start_date         DATE                    NOT NULL,
    employee_birth_date         DATE                    NOT NULL,
    employee_phone_number       VARCHAR(13)             NOT NULL,
    employee_city               VARCHAR(50)             NOT NULL,
    employee_street             VARCHAR(50)             NOT NULL,
    employee_zip_code           VARCHAR(9)              NOT NULL
);

CREATE TABLE IF NOT EXISTS Category
(
    category_number INT PRIMARY KEY NOT NULL,
    category_name   VARCHAR(50)     NOT NULL
);

CREATE TABLE IF NOT EXISTS Product
(
    product_id      INT PRIMARY KEY NOT NULL,
    category_number INT             NOT NULL,
    product_name    VARCHAR(50)     NOT NULL,
    characteristics VARCHAR(100)    NOT NULL,
    FOREIGN KEY (category_number) REFERENCES Category (category_number)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Customer_Card
(
    card_number                 VARCHAR(13) PRIMARY KEY NOT NULL,
    customer_surname            VARCHAR(50)             NOT NULL,
    customer_name               VARCHAR(50)             NOT NULL,
    customer_patronymic         VARCHAR(50)             NULL,
    customer_phone_number       VARCHAR(13)             NOT NULL,
    customer_city               VARCHAR(50)             NULL,
    customer_street             VARCHAR(50)             NULL,
    customer_zip_code           VARCHAR(9)              NULL,
    customer_percent            INT                     NOT NULL
);

CREATE TABLE IF NOT EXISTS Receipt
(
    receipt_id  VARCHAR(10) PRIMARY KEY NOT NULL,
    employee_id VARCHAR(10)             NOT NULL,
    card_number VARCHAR(13)             NOT NULL,
    print_date  DATETIME                NOT NULL,
    sum_total   DECIMAL(13, 4)          NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Employee (employee_id)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (card_number) REFERENCES Customer_Card (card_number)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Store_Product
(
    UPC             VARCHAR(12) PRIMARY KEY NOT NULL,
--    UPC_prom        VARCHAR(12)             NULL,
    product_id      INT                     NOT NULL,
    selling_price   DECIMAL(13, 4)          NOT NULL,
    -- selling_price is already with VAT, user inputs price without VAT, website calculates it with VAT and shows it.
    products_amount INT                     NOT NULL,
    is_promotional  BOOL                    NOT NULL,
--    FOREIGN KEY (UPC_prom) REFERENCES Store_Product (UPC)
--        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (product_id) references Product (product_id)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Sale
(
    UPC             VARCHAR(12)    NOT NULL,
    receipt_id      VARCHAR(10)    NOT NULL,
    products_amount INT            NOT NULL,
    selling_price   DECIMAL(13, 4) NOT NULL,
    PRIMARY KEY (UPC, receipt_id),
    FOREIGN KEY (UPC) REFERENCES Store_Product (UPC)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (receipt_id) REFERENCES Receipt (receipt_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE EVENT IF NOT EXISTS delete_old_receipts
ON SCHEDULE EVERY 1 DAY
DO
    DELETE FROM Receipt WHERE print_date < DATE_SUB(NOW(), INTERVAL 3 YEAR);