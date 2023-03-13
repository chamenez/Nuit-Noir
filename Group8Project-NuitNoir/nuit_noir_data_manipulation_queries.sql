-- Customers

-- Browsing Customers table.
SELECT
Customers.customer_id AS ID,
Customers.customer_name AS Name,
Customers.customer_address AS Address,
Customers.customer_email AS Email,
Customer_Levels.level_name AS 'Level Name'
FROM Customers
LEFT JOIN Customer_Levels ON Customers.customer_level_id = Customer_Levels.customer_level_id;

-- Adding a customer to Customers table.
INSERT INTO Customers (customer_name, customer_address, customer_email, customer_level_id) 
VALUES (:customer_name_Input, :customer_address_Input, :customer_email_Input, :customer_level_id_Input);

-- Update a customer's data based on submission of the Update Customer form to Customers table. 
UPDATE Customers 
SET customer_name = :customer_name_Input, customer_address = :customer_address_Input, customer_email = :customer_email_Input, customer_level_id = :customer_level_id_from_dropdown_Input
WHERE customer_name = :customer_name_from_the_Update_Form;

-- Get all Customer Level IDs and Level Types to populate the Customer_Level dropdown from Customer_Level table.
SELECT customer_level_id, level_name from Customer_Levels;

-- Employees

-- Browsing Employees table.
Select * FROM Employees;

-- Adding an employee to Employees table.
INSERT INTO Employees (employee_name, employee_title) 
VALUES (:employee_name_Input, :employee_title_Input);

-- Update an employee's data based on submission of the Update Employee form to Employees table. 
UPDATE Employees 
SET employee_name = :employee_name_Input, employee_title = :employee_title_Input
WHERE employee_name = :employee_name_from_the_Update_Form;

--Films

--Browsing Films table.
SELECT film_id AS ID, 
film_name AS Film, 
film_price AS Price, 
film_in_stock AS 'In Stock' 
FROM Films;

-- Adding a film to the Films table.
INSERT INTO Films(film_name, film_price, film_in_stock)
VALUES (:film_name_Input, :film_price_Input, :film_in_stock_Input);

--Update a Films data based on input from Update Film form 
UPDATE Films
SET film_name = :film_name_Input, film_price = :film_price_Input, film_in_stock = :film_in_stock_Input
WHERE film_name = :film_name_from_the_Update_Form;

--Orders

--Browsing Orders table.
SELECT Orders.order_id AS ID,
Orders.order_date AS Date,
Orders.total_price AS 'Total Price',
Employees.employee_name AS Employee,
Customers.customer_name AS Customer,
Films.film_name AS 'Film(s)'
FROM Orders
JOIN Employees ON Orders.employee_id = Employees.employee_id
JOIN Customers ON Orders.customer_id = Customers.customer_id
JOIN Orders_Films ON Orders.order_id = Orders_Films.order_id
JOIN Films ON Orders_Films.film_id = Films.film_id           
ORDER BY Orders.order_id ASC;

--Creating an Order
INSERT INTO Orders(order_date, total_price, employee_id, customer_id)
VALUES (:order_date_Input, :total_price_Input, :employee_id_Input, :customer_id_Input);

--Orders_Films

--Browsing Orders_Films table.
SELECT order_id AS 'Order ID', film_name AS Film 
FROM Orders_Films
INNER JOIN Films ON Orders_Films.film_id = Films.film_id
ORDER BY order_id ASC;

--Customer_Levels

--Browsing Customer Levels table.
SELECT customer_level_id AS ID, 
level_name AS 'Level Name', 
level_description AS Description, 
discount_percent AS 'Discount Percent' 
FROM Customer_Levels
ORDER BY discount_percent ASC;
