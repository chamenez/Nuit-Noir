// Get the objects we need to modify
let addEmployeeForm = document.getElementById('add-employee-form-ajax');

// Modify the objects we need
addEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEmployeeName = document.getElementById("input-employee_name");
    let inputEmployeeTitle = document.getElementById("input-employee_title");

    // Get the values from the form fields
    let employeeNameValue = inputEmployeeName.value;
    let employeeTitleValue = inputEmployeeTitle.value;

    // Put our data we want to send in a javascript object
    let data = {
        employee_name: employeeNameValue,
        employee_title: employeeTitleValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputEmployeeName.value = '';
            inputEmployeeTitle.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("employee-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let employeeIdCell = document.createElement("TD");
    let employeeNameCell = document.createElement("TD");
    let employeeTitleCell = document.createElement("TD");

    // Fill the cells with correct data
    employeeIdCell.innerText = newRow.id;
    employeeNameCell.innerText = newRow.fname;
    employeeTitleCell.innerText = newRow.lname;

    // Add the cells to the row 
    row.appendChild(employeeIdCell);
    row.appendChild(employeeNameCell);
    row.appendChild(employeeTitleCell);
    
    // Add the row to the table
    currentTable.appendChild(row);

    window.location.reload();
}