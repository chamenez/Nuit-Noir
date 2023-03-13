// Get the objects we need to modify
let addCustomerLevelForm = document.getElementById('add-customerLevel-form-ajax');

// Modify the objects we need
addCustomerLevelForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLevelName = document.getElementById("input-level_name");
    let inputLevelDescription = document.getElementById("input-level_description");
    let inputDiscountPercent = document.getElementById("input-discount_percent");

    // Get the values from the form fields
    let levelNameValue = inputLevelName.value;
    let levelDescriptionValue = inputLevelDescription.value;
    let discountPercentValue = inputDiscountPercent.value;

    // Put our data we want to send in a javascript object
    let data = {
        level_name: levelNameValue,
        level_description: levelDescriptionValue,
        discount_percent: discountPercentValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer_level-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputLevelName.value = '';
            inputLevelDescription.value = '';
            inputDiscountPercent.value = '';
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
    let currentTable = document.getElementById("customer_levels-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let customerLevelIdCell = document.createElement("TD");
    let levelNameCell = document.createElement("TD");
    let levelDescriptionCell = document.createElement("TD");
    let discountPercentCell = document.createElement("TD");

    // Fill the cells with correct data
    customerLevelIdCell.innerText = newRow.customer_level_id;
    levelNameCell.innerText = newRow.level_name;
    levelDescriptionCell.innerText = newRow.level_description;
    discountPercentCell.innerText = newRow.discount_percent;

    // Add the cells to the row 
    row.appendChild(customerLevelIdCell);
    row.appendChild(levelNameCell);
    row.appendChild(levelDescriptionCell);
    row.appendChild(discountPercentCell);
    
     // Add a custom row attribute so the deleteRow function can find a newly added row
     row.setAttribute('data-value', newRow.customer_level_id);   
    
    // Add the row to the table
    currentTable.appendChild(row);

    window.location.reload();
}