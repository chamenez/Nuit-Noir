// Get the objects we need to modify
let addOrdersFilmsForm = document.getElementById('add-OrdersFilms-form-ajax');

// Modify the objects we need
addOrdersFilmsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("input-order_id");
    let inputFilmId = document.getElementById("input-film_id-ajax");

    // Get the values from the form fields
    let orderIdValue = inputOrderId.value;
    let filmIdValue = inputFilmId.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderIdValue,
        film_id: filmIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-orders_films-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderId.value = '';
            inputFilmId.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Customer Levels
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("orders_films-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let orderIdCell = document.createElement("TD");
    let filmIdCell = document.createElement("TD");
    
    // Fill the cells with correct data
    orderIdCell.innerText = newRow.order_id;
    filmIdCell.innerText = newRow.film_id;

    // Add the cells to the row 
    row.appendChild(orderIdCell);
    row.appendChild(filmIdCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
    window.location.reload();
}