USE supermarket;

-- 1. Додавати нові дані про працівників, постійних клієнтів, категорії товарів, товари, товари у магазині;

-- Додавання нового працівника:
INSERT INTO employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
VALUES ('', '', '', NULL, '', 0, '0-0-0', '0-0-0', '', '', '', '');

-- Додавання нового клієнта:
INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_patronymic, customer_phone_number,
                           customer_city, customer_street, customer_zip_code, customer_percent)
VALUES ('', '', '', NULL, '', NULL, NULL, NULL, 0);

-- Додавання нової категорії товарів:
INSERT INTO Category (category_number, category_name)
VALUES (0, '');

-- Додавання нового товару:
INSERT INTO Product (product_id, category_number, product_name, characteristics)
VALUES (0, 0, '', '');

-- Додавання нового товару у магазин:
INSERT INTO Store_Product (UPC, product_id, selling_price, products_amount, is_promotional)
VALUES ('', 0, 0, 0, FALSE);


-- 2. Редагувати дані про працівників, постійних клієнтів, категорії товарів, товари, товари у магазині;

-- Редагування працівника:
UPDATE Employee
SET employee_id = '',
    employee_surname = '',
    employee_name = '',
    employee_patronymic = NULL,
    employee_role = '',
    employee_salary = 0,
    employee_start_date = '0-0-0',
    employee_birth_date = '0-0-0',
    employee_phone_number = '0',
    employee_city = '',
    employee_street = '',
    employee_zip_code = ''
WHERE employee_id = '';

-- Редагування постійного клієнта:
UPDATE Customer_Card
SET card_number = '',
    customer_surname = '',
    customer_name = '',
    customer_patronymic = NULL,
    customer_phone_number = '0',
    customer_city = NULL,
    customer_street = NULL,
    customer_zip_code = NULL,
    customer_percent = 0
WHERE card_number = '';

-- Редагування категорії товарів:
UPDATE Category
SET category_number = 0,
    category_name = ''
WHERE category_number = 0;

-- Редагування товару:
UPDATE Product
SET product_id = 0,
    category_number = 0,
    product_name = '',
    characteristics = ''
WHERE product_id = 0;

-- Редагування товару у магазині:
UPDATE Store_Product
SET UPC = '',
    product_id = 0,
    selling_price = 0,
    products_amount = 0,
    is_promotional = FALSE
WHERE UPC = '';


-- 3. Видаляти дані про працівників, постійних клієнтів, категорії товарів, товари, товари у магазині, чеки;

-- Видалення даних про працівника:
DELETE FROM Employee
WHERE employee_id = '';

-- Видалення даних про постійного клієнта:
DELETE FROM Customer_Card
WHERE card_number = '';

-- Видалення даних про категорію товарів:
DELETE FROM Category
WHERE category_number = 0;

-- Видалення даних про товар:
DELETE FROM Product
WHERE product_id = 0;

-- Видалення даних про товар у магазині:
DELETE FROM Store_Product
WHERE UPC = '';

-- Видалення даних про чек:
DELETE FROM Receipt
WHERE receipt_id = '';


-- 4. Видруковувати звіти з інформацією про усіх працівників, постійних клієнтів, категорії товарів, товари, товари у магазині, чеки;

-- Звіт про усіх працівників:
USE supermarket;
SELECT *
FROM Employee;

-- Звіт про усіх постійних клієнтів:
SELECT *
FROM Customer_Card;

-- Звіт про усі категорії товарів:
SELECT *
FROM Category;

-- Звіт про усі товари:
SELECT *
FROM Product;

-- Звіт про усі товари у магазині:
SELECT *
FROM Store_Product;

-- Звіт про усі чеки:
SELECT *
FROM Receipt;


-- 5. Отримати інформацію про усіх працівників, відсортованих за прізвищем;
SELECT *
FROM Employee
ORDER BY employee_surname;


-- 6. Отримати інформацію про усіх працівників, що займають посаду касира, відсортованих за прізвищем;
SELECT *
FROM Employee
WHERE employee_role = 'Cashier'
ORDER BY employee_surname;


-- 7. Отримати інформацію про усіх постійних клієнтів, відсортованих за прізвищем;
SELECT *
FROM Customer_Card
ORDER BY customer_surname;


-- 8. Отримати інформацію про усі категорії, відсортовані за назвою;
SELECT *
FROM Category
ORDER BY category_name;


-- 9. Отримати інформацію про усі товари, відсортовані за назвою;
SELECT *
FROM Product
ORDER BY product_name;


-- 10. Отримати інформацію про усі товари у магазині, відсортовані за кількістю;
SELECT *
FROM Store_Product
ORDER BY products_amount;


-- 11. За прізвищем працівника знайти його телефон та адресу;
SELECT employee_id, employee_surname, employee_phone_number, employee_city, employee_street, employee_zip_code
FROM Employee
WHERE employee_surname = '';


-- 12. Отримати інформацію про усіх постійних клієнтів, що мають карту клієнта із певним відсотком, посортованих за прізвищем;
SELECT *
FROM Customer_Card
WHERE customer_percent = 0
ORDER BY customer_surname;


-- 13. Здійснити пошук усіх товарів, що належать певній категорії, відсортованих за назвою;
SELECT *
FROM Product
WHERE category_number = 1
ORDER BY product_name;


-- 14. За UPC-товару знайти ціну продажу товару, кількість наявних одиниць товару, назву та характеристики товару;
SELECT Store_Product.selling_price, Store_Product.products_amount,
       Product.product_name, Product.characteristics
FROM (Store_Product
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
WHERE Store_Product.UPC = '';

-- 15. Отримати інформацію про усі акційні товари, відсортовані за кількістю одиниць товару/ за назвою;

-- за кількістю одиниць товару
SELECT Store_Product.UPC, Store_Product.product_id, Product.product_name, Store_Product.selling_price,
       Store_Product.products_amount, Store_Product.is_promotional, Product.characteristics
FROM (Product
    INNER JOIN Store_Product ON Product.product_id = Store_Product.product_id)
WHERE Store_Product.is_promotional = TRUE
ORDER BY Store_Product.products_amount;

-- за назвою
SELECT Store_Product.UPC, Store_Product.product_id, Product.product_name, Store_Product.selling_price,
       Store_Product.products_amount, Store_Product.is_promotional, Product.characteristics
FROM (Product
         INNER JOIN Store_Product ON Product.product_id = Store_Product.product_id)
WHERE Store_Product.is_promotional = TRUE
ORDER BY Product.product_name;

-- 16. Отримати інформацію про усі НЕ акційні товари, відсортовані за кількістю одиниць товару/ за назвою;

-- за кількістю одиниць товару
SELECT Store_Product.UPC, Store_Product.product_id, Product.product_name, Store_Product.selling_price,
       Store_Product.products_amount, Store_Product.is_promotional, Product.characteristics
FROM (Product
    INNER JOIN Store_Product ON Product.product_id = Store_Product.product_id)
WHERE Store_Product.is_promotional = FALSE
ORDER BY Store_Product.products_amount;

-- за назвою
SELECT Store_Product.UPC, Store_Product.product_id, Product.product_name, Store_Product.selling_price,
       Store_Product.products_amount, Store_Product.is_promotional, Product.characteristics
FROM (Product
    INNER JOIN Store_Product ON Product.product_id = Store_Product.product_id)
WHERE Store_Product.is_promotional = FALSE
ORDER BY Product.product_name;

-- 17. Отримати інформацію про усі чеки, створені певним касиром за певний період часу
-- (з можливістю перегляду куплених товарів у цьому чеку, їх назви, к-сті та ціни);



-- 18. Отримати інформацію про усі чеки, створені усіма касирами за певний період часу
-- (з можливістю перегляду куплених товарів у цьому чеку, їх назва, к-сті та ціни);



-- 19. Визначити загальну суму проданих товарів з чеків, створених певним касиром за певний період часу;
SELECT SUM(Receipt.sum_total) AS total_amount_of_products
FROM (Receipt
    INNER JOIN Employee ON Receipt.employee_id = Employee.employee_id)
WHERE Employee.employee_role = 'Cashier'
  AND Receipt.print_date >= 'початкова_дата'
  AND Receipt.print_date <= 'кінцева_дата';

-- 20. Визначити загальну суму проданих товарів з чеків, створених усіма касиром за певний період часу;



-- 21. Визначити загальну кількість одиниць певного товару, проданого за певний період часу.
SELECT SUM(Sale.products_amount) AS total_units_sold
FROM ((Receipt
    INNER JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
    INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
WHERE Store_Product.product_id = 'ID_товару'
  AND Receipt.print_date >= 'початкова_дата'
  AND Receipt.print_date <= 'кінцева_дата';
