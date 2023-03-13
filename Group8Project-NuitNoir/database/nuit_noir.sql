-- Group 8 Project Database SQL
-- Group Members: Dominic Chavez, James Balden
-- Date: 2/14/2023
-- Updated: 2/22/2023

-- Set Up for Creating Database
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;


--
-- Customer_Levels Table
--
DROP TABLE IF EXISTS `Customer_Levels`;
-- Create table for 'Customer_Levels'
CREATE TABLE `Customer_Levels` (
  `customer_level_id` int(11) NOT NULL AUTO_INCREMENT,
  `level_name` varchar(50) NOT NULL,
  `level_description` varchar(50) NOT NULL,
  `discount_percent` decimal(3,2) NOT NULL,
  PRIMARY KEY (customer_level_id)
);


--
-- Dumping data for table `Customer_Levels`
--

INSERT INTO `Customer_Levels` 
(`customer_level_id`, `level_name`, `level_description`, `discount_percent`) 
VALUES
(1, 'Platinum', '20% Discount', '0.20'),
(2, 'Gold', '10% Discount', '0.10'),
(3, 'Silver', '5% Discount', '0.05');


--
-- Customers Table
--
DROP TABLE IF EXISTS `Customers`;
-- Create table for 'Customers'
CREATE TABLE `Customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(50) NOT NULL,
  `customer_address` varchar(50) NOT NULL,
  `customer_email` varchar(50) NOT NULL,
  `customer_level_id` int(11),
  PRIMARY KEY (customer_id),
  FOREIGN KEY (customer_level_id) REFERENCES Customer_Levels(customer_level_id) ON DELETE SET NULL
);


--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` 
(`customer_id`, `customer_name`, `customer_address`, `customer_email`, `customer_level_id`) 
VALUES
(1, 'Wyatt Earp', '326 Allen Street, Tombstone, AZ 85638', 'helliscomingwithme@gmail.com', 1),
(2, 'Virgil Earp', '408 AZ-80, Tombstone, AZ 85638', 'holdonnothin@gmail.com', 2),
(3, 'Morgan Earp', '417 E Allen St, Tombstone, AZ 85638', 'hiya@gmail.com', 3),
(4, 'Ike Clanton', '535 E Allen St, Tombstone, AZ 85638', 'savvy@gmail.com', NULL),
(5, 'Billy Clanton', '223 E Toughnut St, Tombstone, AZ 85638', 'seeingdouble@gmail.com', 3);


--
-- Employees Table
--
DROP TABLE IF EXISTS `Employees`;
-- Create table for 'Employees'
CREATE TABLE `Employees` (
  `employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(50) NOT NULL,
  `employee_title` varchar(50) NOT NULL,
  PRIMARY KEY (employee_id)
);


--
-- Dumping data for table `Employees`
--

INSERT INTO `Employees` (`employee_id`, `employee_name`, `employee_title`) VALUES
(1, 'Dominic Chavez', 'Manager'),
(2, 'James Balden', 'Manager'),
(3, 'Cole Phelps', 'Clerk'),
(4, 'Elsa Lichtman', 'Clerk');


--
-- Films Table --
--
DROP TABLE IF EXISTS `Films`;
-- Create table for 'Films'
CREATE TABLE `Films` (
  `film_id` int(11) NOT NULL AUTO_INCREMENT,
  `film_name` varchar(50) NOT NULL,
  `film_price` decimal(19,2) NOT NULL,
  `film_in_stock` int(11) NOT NULL,
  PRIMARY KEY (film_id) 
);


--
-- Dumping data for table `Films`
--

INSERT INTO `Films` (`film_id`, `film_name`, `film_price`, `film_in_stock`) VALUES
(1, 'The Maltese Falcon', '12.99', 10),
(2, 'The Third Man', '10.99', 20),
(3, 'Brick', '8.99', 30),
(4, 'LA Noire', '14.99', 40);


--
-- Orders Table
--
DROP TABLE IF EXISTS `Orders`;
-- Create table for 'Orders'
CREATE TABLE `Orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_date` date NOT NULL,
  `total_price` decimal(19,2) NOT NULL,
  `employee_id` int(11),
  `customer_id` int(11),
  PRIMARY KEY (order_id),
  FOREIGN KEY (`employee_id`) REFERENCES `Employees`(`employee_id`) ON DELETE SET NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `Customers`(`customer_id`) ON DELETE SET NULL
);


--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`order_id`, `order_date`, `total_price`, `employee_id`, `customer_id`) VALUES
(1, '1954-10-09', '12.99', 3, 1),
(2, '1951-02-01', '23.98', 2, 2),
(3, '1953-12-18', '32.97', 1, 3),
(4, '1952-01-01', '23.98', 2, 4),
(5, '1955-12-31', '32.97', 3, 3);


--
-- Orders_Films Table
--
DROP TABLE IF EXISTS `Orders_Films`;
-- Create table for 'Orders_Films'
CREATE TABLE `Orders_Films` (
  `order_id` int(11),
  `film_id` int(11),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE SET NULL,
  FOREIGN KEY (film_id) REFERENCES Films(film_id) ON DELETE SET NULL
);


--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders_Films` (`order_id`, `film_id`) VALUES
(1, 2),
(2, 1),
(3, 3),
(1, 3);



-- Wrap Up Settings
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;