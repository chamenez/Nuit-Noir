// Function to delete film and film row from database and Films page table
function deleteFilm(filmID) {
    let link = '/delete-film-ajax/';
    let data = {
        film_id: filmID
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(filmID);
        }
    });
}

// Function to delete row of film from Films page table
function deleteRow(filmID) {
    let table = document.getElementById("film-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == filmID) {
            table.deleteRow(i);
            break;
        }
    }
}