// Get the objects we need to modify
let addFilmForm = document.getElementById('add-film-form-ajax');

// Modify the objects we need
addFilmForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFilmName = document.getElementById("input-film_name");
    let inputFilmPrice = document.getElementById("input-film_price");
    let inputFilmInStock = document.getElementById("input-film_in_stock");

    // Get the values from the form fields
    let filmNameValue = inputFilmName.value;
    let filmPriceValue = inputFilmPrice.value;
    let filmInStockValue = inputFilmInStock.value;

    // Put our data we want to send in a javascript object
    let data = {
        film_name: filmNameValue,
        film_price: filmPriceValue,
        film_in_stock: filmInStockValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-film-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFilmName.value = '';
            inputFilmPrice.value = '';
            inputFilmInStock.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Films
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("film-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let filmIdCell = document.createElement("TD");
    let filmNameCell = document.createElement("TD");
    let filmPriceCell = document.createElement("TD");
    let filmInStockCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    filmIdCell.innerText = newRow.film_id;
    filmNameCell.innerText = newRow.film_name;
    filmPriceCell.innerText = newRow.film_price;
    filmInStockCell.innerText = newRow.film_in_stock;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteFilm(newRow.film_id);
    }

    // Add the cells to the row 
    row.appendChild(filmIdCell);
    row.appendChild(filmNameCell);
    row.appendChild(filmPriceCell);
    row.appendChild(filmInStockCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.film_id);   
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.film_name;
    option.value = newRow.film_id;
    selectMenu.add(option);

    window.location.reload();
}