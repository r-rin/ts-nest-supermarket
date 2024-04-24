-- запити на GROUP BY

-- кількість товарів кожної категорії у конкретному чеку
SELECT
    Category.category_name,
    SUM(Sale.products_amount) AS TotalProducts
FROM ((((Receipt INNER JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
    INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
    INNER JOIN Category ON Product.category_number = Category.category_number)
WHERE Receipt.receipt_id = 'receipt_id'
GROUP BY Category.category_name;


-- сума продажів кожної категорії за певний період:
SELECT
    Category.category_name,
    SUM(Sale.selling_price * Sale.products_amount) AS TotalSales
FROM ((((Category INNER JOIN Product ON Category.category_number = Product.category_number)
    INNER JOIN Store_Product ON Product.product_id = Store_Product.product_id)
    INNER JOIN Sale ON Store_Product.UPC = Sale.UPC)
    INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id)
WHERE Receipt.print_date >= '2024-01-01'
  AND Receipt.print_date < '2024-04-01'
GROUP BY Category.category_name;


-- запит, який виводить інформацію про кожного працівника (його ПІБ), кількість здійснених продажів (чеків) та загальну суму продажів
SELECT
    Employee.employee_surname, Employee.employee_name, Employee.employee_patronymic,
    COUNT(DISTINCT Receipt.receipt_id) AS TotalSalesCount,
    SUM(Sale.selling_price) AS TotalSalesAmount
FROM ((Employee LEFT JOIN Receipt ON Employee.employee_id = Receipt.employee_id)
        LEFT JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
GROUP BY Employee.employee_id;
