USE supermarket;

-- EMPLOYEE
-- managers
INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP002', 'Johnson', 'Emily', 'Pauline', 0, 3500.00, '2022-11-20', '1985-09-12', '+1987654321',
        'Los Angeles', 'Broadway', '90001');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP005', 'Brown', 'Michael', 'Christopher', 0, 3200.00, '2023-02-05', '1988-03-25', '+1321567890',
        'Houston', 'Elm St.', '77001');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP007', 'Garcia', 'Sophia', 0, 3400.00, '2023-03-15', '1991-07-18', '+1654321890',
        'Miami', 'Palm St.', '33101');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP009', 'Martinez', 'Daniel', 0, 3300.00, '2023-04-10', '1993-11-30', '+1789056432',
        'Atlanta', 'Maple St.', '30301');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP010', 'Lee', 'Jennifer', 0, 3100.00, '2023-05-20', '1987-08-05', '+1908765432',
        'Seattle', 'Oak St.', '98101');

-- cashiers
INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP001', 'Smith', 'John', 'Andrew', 1, 2500.00, '2023-01-15', '1990-05-20', '+1234567890',
        'New York', 'Main St.', '10001');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('EMP003', 'Williams', 'David', 'Edward', 1, 2300.00, '2023-03-10', '1995-02-28', '+1324354657',
        'Chicago', 'Oak St.', '60601');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP004', 'Jones', 'Jessica', 1, 2400.00, '2023-01-25', '1992-09-15', '+1432576890',
        'San Francisco', 'Pine St.', '94101');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP006', 'Davis', 'Robert', 1, 2600.00, '2023-04-05', '1994-06-10', '+1567890234',
        'Dallas', 'Cedar St.', '75201');

INSERT INTO employee (employee_id, employee_surname, employee_name, employee_role, employee_salary,
                      employee_start_date, employee_birth_date, employee_phone_number, employee_city,
                      employee_street, employee_zip_code)
VALUES ('EMP008', 'Rodriguez', 'Amanda', 1, 2700.00, '2023-02-28', '1993-12-20', '+1678904321',
        'Phoenix', 'Willow St.', '85001');


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
VALUES ('CARD001', 'Johnson', 'Michael', 'Alexander', '+1234567890', 'New York', 'Main St.', '10001', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD002', 'Williams', 'Emily', '+1987654321', 15);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_city,
                           customer_street, customer_zip_code, customer_percent)
VALUES ('CARD003', 'Brown', 'Jennifer', '+1654321890', 'Los Angeles', 'Oak St.', '90001', 20);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD004', 'Jones', 'Christopher', '+1765432981', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD005', 'Miller', 'Jessica', '+1321987654', 5);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD006', 'Taylor', 'David', '+1908765432', 15);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD007', 'Wilson', 'Sarah', '+1987654321', 20);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD008', 'Martinez', 'Andrew', '+1765432890', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_city,
                           customer_street, customer_zip_code, customer_percent)
VALUES ('CARD009', 'Anderson', 'Amanda', '+1654321987', 'Chicago', 'Elm St.', '60601', 10);

INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_phone_number, customer_percent)
VALUES ('CARD010', 'Thomas', 'Ashley', '+1321890765', 5);


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
INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC001', 1, 1.20, 500, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC002', 2, 0.90, 300, TRUE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC003', 3, 7.50, 200, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC004', 4, 12.00, 150, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC005', 5, 1.80, 400, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC006', 6, 1.60, 350, TRUE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC007', 7, 2.50, 600, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC008', 8, 2.00, 450, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC009', 9, 3.60, 200, TRUE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC010', 10, 1.20, 700, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC011', 11, 0.80, 600, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC012', 12, 10.50, 250, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC013', 13, 5.00, 400, TRUE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC014', 14, 2.20, 300, FALSE);

INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('UPC015', 15, 1.60, 500, FALSE);


-- SALE
INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC001', 'RCP001', 3, 3.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC002', 'RCP001', 2, 1.80);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC003', 'RCP002', 1, 7.50);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC004', 'RCP002', 2, 24.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC005', 'RCP003', 2, 3.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC006', 'RCP003', 3, 4.80);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC007', 'RCP004', 4, 10.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC008', 'RCP004', 3, 6.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC009', 'RCP005', 1, 3.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC010', 'RCP005', 2, 2.40);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC011', 'RCP006', 4, 3.20);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC012', 'RCP006', 1, 10.50);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC013', 'RCP007', 2, 10.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC014', 'RCP007', 3, 6.60);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC015', 'RCP008', 2, 3.20);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC001', 'RCP008', 1, 1.20);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC002', 'RCP009', 2, 1.80);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC003', 'RCP009', 3, 22.50);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC004', 'RCP010', 2, 24.00);

INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
VALUES ('UPC005', 'RCP010', 3, 5.40);
