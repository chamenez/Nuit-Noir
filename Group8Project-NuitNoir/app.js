/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 9039;
const path = require('path');
// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars

// Handlebars Helpers set up

// Code Citation for Handlebars Helper Set Up
// Date: 3/2/2023
// Based on:
// Source URL: https://www.youtube.com/watch?v=2BoSBaWvFhM

const hbs = exphbs.create({
    extname: ".hbs",

    // helpers for working with data manipulated with handlebars
    helpers: {
        // Formats dates to more reader friendly output
        dateFormat: function(date) {
            return date.toLocaleDateString("en-US");
        }
    }
});

app.engine('.hbs', hbs.engine);  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.set('views', path.join(__dirname, 'views'));

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');
    });

app.get('/customers', function(req, res)
    {
        let query1;
        if (req.query.customer_name === undefined)
        {
            query1 = `SELECT Customers.customer_id AS ID,
            Customers.customer_name AS Name,
            Customers.customer_address AS Address,
            Customers.customer_email AS Email,
            Customer_Levels.level_name AS 'Level Name'
            FROM Customers
            LEFT JOIN Customer_Levels ON Customers.customer_level_id = Customer_Levels.customer_level_id;`;
        }
        else
        {
            query1 = `SELECT Customers.customer_id AS ID,
            Customers.customer_name AS Name,
            Customers.customer_address AS Address,
            Customers.customer_email AS Email,
            Customer_Levels.level_name AS 'Level Name'
            FROM Customers
            LEFT JOIN Customer_Levels ON Customers.customer_level_id = Customer_Levels.customer_level_id 
            WHERE customer_name LIKE  
            "$req.query.customer_name}%";`;
        }
        let query2 = `SELECT * FROM Customer_Levels;`;
        db.pool.query(query1, function(error, rows, fields){
            let customers = rows;
            db.pool.query(query2, (error, rows, fields) => {
                let customer_levels = rows;
                return res.render('customers', {data: customers, customer_level: customer_levels});
            })
        })
    });

app.post('/add-customer-ajax', function(req, res)
{
    let data = req.body;
    let customer_level_id = parseInt(data.customer_level_id)
    if (isNaN(customer_level_id))
    {
        customer_level_id = "NULL"
    }

    query1 = `INSERT INTO Customers (customer_name, customer_address, customer_email, customer_level_id) VALUES ('${data.customer_name}', '${data.customer_address}', '${data.customer_email}', ${customer_level_id})`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-customer-ajax', function(req, res, next){
    let data = req.body;
  
    let customerLevel = parseInt(data.customer_level);
    let customerName = parseInt(data.customer_name);

    if (isNaN(customerLevel)) 
    {
        customerLevel = "NULL";
    }
  
    let queryUpdateCustomerLevel = `UPDATE Customers SET customer_level_id = ${customerLevel} WHERE customer_id = ${customerName}`;
    let selectCustomerLevel = `SELECT * FROM Customer_Levels WHERE customer_level_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateCustomerLevel, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectCustomerLevel, [customerLevel], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.customer_id);
    let deleteNNCustomer = `DELETE FROM Customers WHERE customer_id = ?`;
    db.pool.query(deleteNNCustomer, [customerID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});

app.get('/employees', function(req, res)
    {
        let query1 = `SELECT employee_id AS ID, 
        employee_name AS Name, 
        employee_title AS Title
        FROM Employees;`;
        db.pool.query(query1, function(error, rows, fields){
            res.render('employees', {data: rows});
        })
    });

app.post('/add-employee-ajax', function(req, res)
{
    let data = req.body;
    query1 = `INSERT INTO Employees (employee_name, employee_title) VALUES ('${data.employee_name}', '${data.employee_title}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Employees;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/films', function(req, res)
    {
        let query1 = `SELECT film_id AS ID, 
        film_name AS Film, 
        film_price AS Price, 
        film_in_stock AS 'In Stock' 
        FROM Films;`;
        db.pool.query(query1, function(error, rows, fields){
            let films = rows;
            res.render('films', {data: films});
        })
    });

app.post('/add-film-ajax', function(req, res)
{
    let data = req.body;
    
    query1 = `INSERT INTO Films (film_name, film_price, film_in_stock) VALUES ('${data.film_name}', '${data.film_price}', '${data.film_in_stock}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT film_id AS ID, 
            film_name AS Film, 
            film_price AS Price, 
            film_in_stock AS 'In Stock' 
            FROM Films;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// Citation for use of placeholders in template literals rather than ?
// Date: 3/4/2023
// Based on information from discussion on Ed:
// Source URL: https://edstem.org/us/courses/32532/discussion/2720506
app.put('/put-film-ajax', function(req, res, next){
    let data = req.body;
  
    let queryUpdateFilms = `UPDATE Films SET film_price = '${data.film_price}', film_in_stock = '${data.film_in_stock}' WHERE Films.film_id = '${parseInt(data.film_id)}'`;
  
          // Run the query
          db.pool.query(queryUpdateFilms, function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.send(rows);   
              }
  })});

app.delete('/delete-film-ajax/', function(req,res,next){
    let data = req.body;
    let filmID = parseInt(data.film_id);
    let deleteNNFilm = `DELETE FROM Films WHERE film_id = ?`;
    db.pool.query(deleteNNFilm, [filmID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else
        { 
            res.sendStatus(204);
        }
    })
});

        

app.get('/orders', function(req, res)
    {
        let query1 = `SELECT Orders.order_id AS ID,
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
        ORDER BY Orders.order_id ASC;`;

        let query2 = `SELECT * FROM Employees;`;

        let query3 = `SELECT * FROM Customers;`;

        let query4 = `SELECT * FROM Films;`;

        db.pool.query(query1, function(error, rows, fields){

            let orders = rows;
            db.pool.query(query2, (error, rows, fields) => {

                let employees = rows;
                db.pool.query(query3, (error, rows, fields) => {

                    let customers = rows;
                    db.pool.query(query4, (error, rows, fields) => {

                        let films = rows;
                        return res.render('orders', {data: orders, employees: employees, customers: customers, films: films});
                    })
                })
            })     
        })
    });

app.post('/add-order-ajax', function(req, res){
    let data = req.body;

    query1 = `INSERT INTO Orders (order_date, total_price, employee_id, customer_id) VALUES
    ('${data.order_date}', '${data.total_price}', '${data.employee_id}', '${data.customer_id}');`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }  
        
        // Code citation for the use of insertId for finding last created primary key id
        // Date: 3/6/2023
        // Based on information from:
        // Source URL: https://www.mysqltutorial.org/mysql-nodejs/insert/
        else {
            let order_id = rows.insertId;
            query2 = `INSERT INTO Orders_Films (order_id, film_id) VALUES
            (${order_id}, '${data.film_id}');`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    query3 = `SELECT Orders.order_id AS ID,
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
                    ORDER BY Orders.order_id ASC;`;
                    db.pool.query(query3, function(error, rows, fields){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            res.send(rows);
                        }
                    })
                }
            })           
        }
    })    
});

app.get('/orders_films', function(req, res)
    {
        let query1 = `SELECT order_id AS 'Order ID', film_name AS Film 
        FROM Orders_Films
        INNER JOIN Films ON Orders_Films.film_id = Films.film_id
        ORDER BY order_id ASC;`;

        let query2 = `SELECT * FROM Films;`;

        db.pool.query(query1, function(error, rows, fields){
            
            let orders = rows;
            db.pool.query(query2, (error, rows, fields) => {

                let films = rows;
                return res.render('orders_films', {data: orders, films: films});
            })           
        })
    });

app.post('/add-orders_films-ajax', function(req, res)
{
    let data = req.body;
    
    query1 = `INSERT INTO Orders_Films (order_id, film_id) VALUES ('${data.order_id}', '${data.film_id}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Orders_Films`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/customer_levels', function(req, res)
    {
        let query1 = `SELECT customer_level_id AS ID, 
        level_name AS 'Level Name', 
        level_description AS Description, 
        discount_percent AS 'Discount Percent' 
        FROM Customer_Levels
        ORDER BY discount_percent ASC;`;
        db.pool.query(query1, function(error, rows, fields){
            res.render('customer_levels', {data: rows});
        })
    });

app.post('/add-customer_level-ajax', function(req, res) 
{
    let data = req.body;
    
    query1 = `INSERT INTO Customer_Levels (level_name, level_description, discount_percent) VALUES ('${data.level_name}', '${data.level_description}', '${data.discount_percent}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT customer_level_id AS ID, 
            level_name AS 'Level Name', 
            level_description AS Description, 
            discount_percent AS 'Discount Percent' 
            FROM Customer_Levels
            ORDER BY discount_percent ASC;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});