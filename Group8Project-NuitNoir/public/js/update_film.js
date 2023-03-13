// Get the objects we need to modify
let updateFilmForm = document.getElementById('update-film-form-ajax');

// Modify the objects we need
updateFilmForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFilmId = document.getElementById("mySelect");
    let inputFilmPrice = document.getElementById("input-film_price-update");
    let inputFilmInStock = document.getElementById("input-film_in_stock-update");

    // Get the values from the form fields
    let filmIdValue = inputFilmId.value;
    let filmPriceValue = inputFilmPrice.value;
    let filmInStockValue = inputFilmInStock.value;

    // Put our data we want to send in a javascript object
    let data = {
        film_id: filmIdValue,
        film_price: filmPriceValue,
        film_in_stock: filmInStockValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-film-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, filmIdValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, filmID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("film-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == filmID) {
            
            // Get the location of the row where we found the matching Film ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            
            // Get the td of film price and film in stock value
            let filmPriceTd = updateRowIndex.getElementsByTagName("td")[2];
            let filmInStockTd = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign Film attributes to our values we updated to 
            filmPriceTd.innerHTML = parsedData.film_price;
            filmInStockTd.innerHTML = parsedData.film_in_stock;
       }
    }
    window.location.reload();
}