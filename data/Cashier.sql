USE supermarket;

-- Касир:
-- 1. Отримати інформацію про усі товари, відсортовані за назвою;
SELECT *
FROM Product
ORDER BY product_name;


-- 2. Отримати інформацію про усі товари у магазині, відсортовані за назвою;
SELECT *
FROM (Store_Product
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
ORDER BY Product.product_name;


-- 3. Отримати інформацію про усіх постійних клієнтів, відсортованих за прізвищем;
SELECT *
FROM Customer_Card
ORDER BY customer_surname;


-- 4. Здійснити пошук товарів за назвою;
SELECT *
FROM Product
WHERE product_name = 'назва_товару';


-- 5. Здійснити пошук товарів, що належать певній категорії, відсортованих за назвою;
SELECT Category.category_name, Product.product_id, Product.product_name, Product.characteristics
FROM (Product
    INNER JOIN Category ON Product.category_number = Category.category_number)
WHERE Category.category_name = 'певна_категорія'
ORDER BY Product.product_name;


-- 6. Здійснити пошук постійних клієнтів за прізвищем;
SELECT *
FROM Customer_Card
WHERE customer_surname = 'прізвище';

-- 7. Здійснювати продаж товарів (додавання чеків);
INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total)
VALUES ('', '', '', '000-00-00', 0);


-- 8. Додавати/редагувати інформацію про постійних клієнтів;

-- додати клієнта
INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_patronymic, customer_phone_number,
                           customer_city, customer_street, customer_zip_code, customer_percent)
VALUES ('', '', '', NULL, '', NULL, NULL, NULL, 0);

-- редагувати інформацію про клієнтів
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

-- 9. Переглянути список усіх чеків, що створив касир за цей день;
SELECT Receipt.receipt_id, Receipt.employee_id, Employee.employee_surname, Employee.employee_name, Receipt.print_date
FROM (Receipt
    INNER JOIN Employee ON Receipt.employee_id = Employee.employee_id)
WHERE Employee.employee_role = 2
  AND Employee.employee_id = 'певний_касир'
  AND Receipt.print_date = CURDATE();


-- 10. Переглянути список усіх чеків, що створив касир за певний період часу;
SELECT Receipt.receipt_id, Receipt.employee_id, Employee.employee_surname, Employee.employee_name, Receipt.print_date
FROM (Receipt
    INNER JOIN Employee ON Receipt.employee_id = Employee.employee_id)
WHERE Employee.employee_role = 2
  AND Employee.employee_id = 'певний_касир'
  AND Receipt.print_date >= 'початкова_дата'
  AND Receipt.print_date <= 'кінцева_дата';


-- 11. За номером чеку вивести усю інформацію про даний чек, в тому числі інформацію про назву, к-сть та ціну товарів, придбаних в даному чеку.
SELECT Receipt.receipt_id, Receipt.employee_id, Receipt.print_date,
       Product.product_name, Sale.selling_price, Sale.products_amount
FROM (((Receipt
    INNER JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
    INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
WHERE Receipt.receipt_id = '';


-- 12. Отримати інформацію про усі акційні товари, відсортовані за кількістю одиниць товару/ за назвою;

-- відсортовані за кількістю одиниць товару:
SELECT Store_Product.UPC, Product.product_id, Product.product_name, Product.characteristics,
       Store_Product.products_amount, Store_Product.selling_price
FROM (Store_Product
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
WHERE Store_Product.is_promotional = TRUE
ORDER BY Store_Product.products_amount DESC;

-- відсортовані за назвою:
SELECT Store_Product.UPC, Product.product_id, Product.product_name, Product.characteristics,
       Store_Product.products_amount, Store_Product.selling_price
FROM (Store_Product
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
WHERE Store_Product.is_promotional = TRUE
ORDER BY Product.product_name;


-- 13. Отримати інформацію про усі НЕ акційні товарів, відсортовані за кількістю одиниць товару/ за назвою;

-- відсортовані за кількістю одиниць товару:
SELECT Store_Product.UPC, Product.product_id, Product.product_name, Product.characteristics,
       Store_Product.products_amount, Store_Product.selling_price
FROM (Store_Product
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
WHERE Store_Product.is_promotional = FALSE
ORDER BY Store_Product.products_amount DESC;

-- відсортовані за назвою:
SELECT Store_Product.UPC, Product.product_id, Product.product_name, Product.characteristics,
       Store_Product.products_amount, Store_Product.selling_price
FROM (Store_Product
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
WHERE Store_Product.is_promotional = FALSE
ORDER BY Product.product_name;


-- 14. За UPC-товару знайти ціну продажу товару, кількість наявних одиниць товару.
SELECT selling_price, products_amount
FROM Store_Product
WHERE UPC = '';


-- 15. Можливість отримати усю інформацію про себе.
SELECT *
FROM Employee
WHERE employee_id = '';

