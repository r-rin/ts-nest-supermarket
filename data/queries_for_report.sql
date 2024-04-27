-- ЗАПИТИ НА GROUP BY

-- кількість товарів кожної категорії у конкретному чеку
SELECT
    Receipt.receipt_id, Category.category_name,
    SUM(Sale.products_amount) AS TotalProducts
FROM ((((Receipt
    INNER JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
    INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
    INNER JOIN Category ON Product.category_number = Category.category_number)
WHERE
    Receipt.receipt_id = 'receipt_id'
GROUP BY
    Category.category_name;


-- сума продажів кожної категорії за певний період:
SELECT
    Category.category_name,
    SUM(Sale.selling_price * Sale.products_amount) AS TotalSales
FROM ((((Category
    INNER JOIN Product ON Category.category_number = Product.category_number)
    INNER JOIN Store_Product ON Product.product_id = Store_Product.product_id)
    INNER JOIN Sale ON Store_Product.UPC = Sale.UPC)
    INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id)
WHERE
    Receipt.print_date >= '2023-01-01'
  AND Receipt.print_date < '2024-04-01'
GROUP BY
    Category.category_name;


-- запит, який виводить інформацію про кожного працівника (його ПІБ),
-- кількість здійснених продажів (чеків) та загальну суму продажів
/*SELECT
    Employee.employee_surname,
    Employee.employee_name,
    Employee.employee_patronymic,
    COUNT(DISTINCT Receipt.receipt_id) AS TotalSalesCount,
    SUM(Sale.selling_price) AS TotalSalesAmount
FROM ((Employee
    LEFT JOIN Receipt ON Employee.employee_id = Receipt.employee_id)
    LEFT JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
GROUP BY
    Employee.employee_id,
    Employee.employee_surname,
    Employee.employee_name
ORDER BY
    Employee.employee_surname, Employee.employee_name;*/


-- кількість продажів кожного предмету для кожного працівника
SELECT
    Employee.employee_id,
    Employee.employee_surname,
    Employee.employee_name,
    Product.product_name,
    COUNT(Sale.receipt_id) AS TotalSalesCount
FROM ((((Employee
    LEFT JOIN Receipt ON Employee.employee_id = Receipt.employee_id)
    LEFT JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
    LEFT JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
    LEFT JOIN Product ON Store_Product.product_id = Product.product_id)
GROUP BY
    Employee.employee_id,
    Employee.employee_surname,
    Employee.employee_name,
    Product.product_name
ORDER BY
    Employee.employee_surname, Product.product_name;



-- ЗАПИТИ НА ПОДВІЙНЕ ЗАПЕРЕЧЕННЯ

-- знайти номери карт клієнтів, які здійснили покупки усіх категорій продуктів
-- цей запит не працює, ХЕЛП
/*SELECT Customer_Card.card_number
FROM Customer_Card
WHERE NOT EXISTS (
                SELECT Category.category_number
                FROM Category
                WHERE NOT EXISTS (
                                SELECT Product.product_id
                                FROM Product
                                WHERE Product.category_number = Category.category_number
                                    AND NOT EXISTS (
                                                SELECT Sale.receipt_id
                                                FROM ((Sale
                                                INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
                                                INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id)
                                                WHERE Store_Product.product_id = Product.product_id
                                                    AND Receipt.card_number = Customer_Card.card_number
                                    )
                )
);
*/

-- 2 варіант
-- знайде клієнтів, які здійснили покупки у всіх категоріях товарів
SELECT cc.card_number,
       cc.customer_surname,
       cc.customer_name,
       cc.customer_phone_number
FROM Customer_Card cc
WHERE NOT EXISTS (
                SELECT category_number
                FROM Category
                WHERE NOT EXISTS (
                            SELECT *
                            FROM Product
                            WHERE Product.category_number = Category.category_number
                            AND EXISTS (
                                    SELECT *
                                    FROM (Sale
                                        INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id)
                                    WHERE Receipt.card_number = cc.card_number
                                    AND Sale.UPC IN (
                                                SELECT UPC
                                                FROM Store_Product
                                                WHERE Store_Product.product_id = Product.product_id
            )
        )
    )
);


-- знайти клієнтів, які не здійснили жодних покупок певного предмету
SELECT Customer_Card.card_number,
       Customer_Card.customer_surname,
       Customer_Card.customer_name,
       Customer_Card.customer_phone_number
FROM Customer_Card
WHERE NOT EXISTS (
                SELECT *
                FROM Product
                WHERE Product.product_name = 'Яблуко'
                AND NOT EXISTS (
                            SELECT Sale.receipt_id
                            FROM ((Sale
                            INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
                            INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id)
                            WHERE Store_Product.product_id = Product.product_id
                                AND Receipt.card_number = Customer_Card.card_number
                )
);

-- знайти предмети, які не були продані протягом певного періоду часу
SELECT Product.product_name, Product.category_number, Category.category_name
FROM (Product
    INNER JOIN Category ON Product.category_number = Category.category_number)
WHERE NOT EXISTS (
                SELECT Store_Product.product_id
                FROM Store_Product
                WHERE Store_Product.product_id = Product.product_id
                AND NOT EXISTS (
                            SELECT Sale.receipt_id
                            FROM (Sale
                            INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id)
                            WHERE Sale.UPC = Store_Product.UPC
                                AND Receipt.print_date >= '2023-01-01'
                                AND Receipt.print_date <= '2023-12-31'
                )
);


-- Знайти товари, які не були продані певним касиром:
-- ну це мега сумнівний варіант
/*SELECT Product.product_name, Product.category_number, Category.category_name
FROM (Product
    INNER JOIN Category ON Product.category_number = Category.category_number)
WHERE NOT EXISTS (
                SELECT *
                FROM Sale
                    INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id
                WHERE NOT EXISTS (
                            SELECT *
                            FROM Employee
                            WHERE Employee.employee_id = Receipt.employee_id
                                AND Employee.employee_id = 'employee_id'
                )
                AND Sale.UPC IN (
                                SELECT UPC
                                FROM Store_Product
                                WHERE Store_Product.product_id = Product.product_id
                )
);
*/

