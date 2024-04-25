USE supermarket;

-- EMPLOYEE
-- managers
INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP002', 'Johnson', 'Emily', 'Pauline', 1, 3500.00, '2022-11-20', '1985-09-12', '+198765432166',
        'Los Angeles', 'Broadway', '90001');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP005', 'Brown', 'Michael', 'Christopher', 1, 3200.00, '2023-02-05', '1988-03-25', '+132156789067',
        'Houston', 'Elm St.', '77001');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP007', 'Garcia', 'Sophia', 1, 3400.00, '2023-03-15', '1991-07-18', '+165432189063',
        'Miami', 'Palm St.', '33101');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP009', 'Martinez', 'Daniel', 1, 3300.00, '2023-04-10', '1993-11-30', '+178905643264',
        'Atlanta', 'Maple St.', '30301');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP010', 'Lee', 'Jennifer', 1, 3100.00, '2023-05-20', '1987-08-05', '+190876543225',
        'Seattle', 'Oak St.', '98101');

-- cashiers
INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP001', 'Smith', 'John', 'Andrew', 0, 2500.00, '2023-01-15', '1990-05-20', '+123456776890',
        'New York', 'Main St.', '10001');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP003', 'Williams', 'David', 'Edward', 0, 2300.00, '2023-03-10', '1995-02-28', '+166324354657',
        'Chicago', 'Oak St.', '60601');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP004', 'Jones', 'Jessica', 0, 2400.00, '2023-01-25', '1992-09-15', '+143256676890',
        'San Francisco', 'Pine St.', '94101');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP006', 'Davis', 'Robert', 0, 2600.00, '2023-04-05', '1994-06-10', '+156786690234',
        'Dallas', 'Cedar St.', '75201');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP008', 'Rodriguez', 'Amanda', 0, 2700.00, '2023-02-28', '1993-12-20', '+167890664321',
        'Phoenix', 'Willow St.', '85001');


-- AUTH DATA
INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP002', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP005', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP007', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP009', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP010', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP001', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP003', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP004', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP006', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');

INSERT INTO Auth_data(employee_id, password_hash)
VALUES ('EMP008', '$2a$10$TPM0CXfSEJrRjlnJKYSfjubP5rxnxKw2rQ9hMVYz.lgUkvxJnhq62');


-- CATEGORY
INSERT INTO Category (category_number, category_name)
VALUES (1, 'Vegetables and Fruits');

INSERT INTO Category (category_number, category_name)
VALUES (2, 'Meat and Poultry');

INSERT INTO Category (category_number, category_name)
VALUES (3, 'Dairy Products');

INSERT INTO Category (category_number, category_name)
VALUES (4, 'Grains and Bakery Products');

INSERT INTO Category (category_number, category_name)
VALUES (5, 'Confectionery Products');


-- PRODUCT
INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (1, 1, 'Apple', 'Variety: Fuji, Origin: USA, Weight: 150g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (2, 1, 'Banana', 'Variety: Cavendish, Origin: Ecuador, Weight: 120g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (3, 2, 'Chicken Breast', 'Farm-raised, Skinless, Boneless, Weight: 500g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (4, 2, 'Beef Steak', 'Grass-fed, Ribeye Cut, Weight: 300g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (5, 3, 'Milk', 'Whole Milk, Pasturized, 1L');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (6, 3, 'Yogurt', 'Greek Yogurt, Plain, 200g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (7, 4, 'Bread', 'Whole Wheat Bread, Sliced, 500g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (8, 4, 'Pasta', 'Spaghetti, Durum Wheat, 400g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (9, 5, 'Chocolate Bar', 'Dark Chocolate, 70% Cocoa, 100g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (10, 5, 'Candy', 'Assorted Candy, Fruit Flavors, 200g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (11, 1, 'Carrot', 'Organic Carrot, Fresh, 250g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (12, 2, 'Salmon Fillet', 'Wild-caught Salmon, Skin-on, 300g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (13, 3, 'Eggs', 'Free-range Eggs, Large, 12 count');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (14, 4, 'Baguette', 'French Baguette, Artisan Bread, 300g');

INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (15, 5, 'Gummy Bears', 'Assorted Gummy Bears, Jelly Candy, 150g');


-- CUSTOMER_CARD
INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_patronymic, customer_phone_number,
                           customer_city, customer_street, customer_zip_code, customer_percent)
VALUES ('CARD001', 'Johnson', 'Michael', 'Alexander', '+123488567890', 'New York', 'Main St.', '10001', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD002', 'Williams', 'Emily', '+198765884321', 15);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_city,
                           customer_street, customer_zip_code, customer_percent)
VALUES ('CARD003', 'Brown', 'Jennifer', '+165438821890', 'Los Angeles', 'Oak St.', '90001', 20);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD004', 'Jones', 'Christopher', '+176885432981', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD005', 'Miller', 'Jessica', '+132881987654', 5);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD006', 'Taylor', 'David', '+190876885432', 15);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD007', 'Wilson', 'Sarah', '+198765884321', 20);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD008', 'Martinez', 'Andrew', '+176885432890', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_city,
                           customer_street, customer_zip_code, customer_percent)
VALUES ('CARD009', 'Anderson', 'Amanda', '+165884321987', 'Chicago', 'Elm St.', '60601', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD010', 'Thomas', 'Ashley', '+132189078865', 5);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD011', 'Thomas', 'Ashley', '+132189088765', 5);


-- RECEIPT
INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP001', 'EMP001', 'CARD001', '2023-01-01 09:30:00', 150.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP002', 'EMP003', 'CARD002', '2023-01-01 10:15:00', 200.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP003', 'EMP004', 'CARD003', '2023-01-02 11:45:00', 75.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP004', 'EMP006', 'CARD004', '2023-01-02 13:30:00', 300.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP005', 'EMP008', 'CARD005', '2023-01-03 15:00:00', 180.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP006', 'EMP001', 'CARD006', '2023-01-04 09:30:00', 250.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP007', 'EMP003', 'CARD007', '2023-01-04 10:45:00', 100.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP008', 'EMP004', 'CARD008', '2023-01-05 12:15:00', 180.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP009', 'EMP006', 'CARD009', '2023-01-05 14:30:00', 210.00);

INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('RCP010', 'EMP008', 'CARD010', '2023-01-06 16:00:00', 120.00);


-- STORE_PRODUCT
INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('799439112766', NULL, 1, 1.20, 500, FALSE, '2024-04-15', '2025-04-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('835346892595', NULL, 2, 0.80, 100, TRUE, '2024-04-15', '2024-10-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('835492647199', '835346892595', 2, 0.90, 300, FALSE, '2024-04-15', '2024-10-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('745395624954', NULL, 3, 7.50, 200, FALSE, '2024-04-15', '2025-01-01');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('047528562575', NULL, 4, 12.00, 150, FALSE, '2024-04-15', '2025-06-01');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('639364958364', NULL, 5, 1.80, 400, FALSE, '2024-04-15', '2025-04-30');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('764573470741', NULL, 6, 1.40, 50, TRUE, '2024-04-15', '2024-08-15');


INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('363856387564', '764573470741', 6, 1.60, 350, FALSE, '2024-04-15', '2024-08-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('237236478662', NULL, 7, 2.50, 600, FALSE, '2024-04-15', '2025-02-28');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('284585633733', NULL, 8, 2.00, 450, FALSE, '2024-04-15', '2024-12-31');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('844578742257', NULL, 9, 3.00, 50, TRUE, '2024-04-15', '2025-03-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('848758399847', '844578742257', 9, 3.60, 200, FALSE, '2024-04-15', '2025-03-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('194548204654', NULL, 10, 1.20, 700, FALSE, '2024-04-15', '2024-11-30');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('857473824767', NULL, 11, 0.80, 600, FALSE, '2024-04-15', '2024-10-31');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('273778543627', NULL, 12, 10.50, 250, FALSE, '2024-04-15', '2025-05-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('963145796352', NULL, 13, 4.00, 100, TRUE, '2024-04-15', '2024-09-30');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('393847682735', '963145796352', 13, 5.00, 400, FALSE, '2024-04-15', '2024-09-30');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('937475784373', NULL, 14, 2.20, 300, FALSE, '2024-04-15', '2024-12-15');

INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
VALUES ('937474829670', NULL, 15, 1.60, 500, FALSE, '2024-04-15', '2025-01-31');


-- SALE
INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('799439112766', 'RCP001', 3, 3.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('835492647199', 'RCP001', 2, 1.80);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('745395624954', 'RCP002', 1, 7.50);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('047528562575', 'RCP002', 2, 24.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('639364958364', 'RCP003', 2, 3.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('363856387564', 'RCP003', 3, 4.80);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('237236478662', 'RCP004', 4, 10.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('284585633733', 'RCP004', 3, 6.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('848758399847', 'RCP005', 1, 3.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('194548204654', 'RCP005', 2, 2.40);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('857473824767', 'RCP006', 4, 3.20);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('273778543627', 'RCP006', 1, 10.50);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('393847682735', 'RCP007', 2, 10.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('937475784373', 'RCP007', 3, 6.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('937474829670', 'RCP008', 2, 3.20);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('799439112766', 'RCP008', 1, 1.20);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('835492647199', 'RCP009', 2, 1.80);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('745395624954', 'RCP009', 3, 22.50);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('047528562575', 'RCP010', 2, 24.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('639364958364', 'RCP010', 3, 5.40);
