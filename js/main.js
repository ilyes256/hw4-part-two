/* 
        Name: Ilyes Abdellatif Bouazza
        Email : ilyesabdellatif_bouazza@student.uml.edu
        University: UMass Lowell
        Class: GUI 1 Fall 2024
        Homework 4: Using the jQuery Plugin/UI with Your Dynamic Table
        PART 2: jQuery UI Slider and Tab Widgets
        FILE : main.js 
        */

// constants class,all memmbers are static so we can have them without an object
class CONSTANTS {
  //min and max values for rows and columns
  static MIN_COLUMN_VALUE = -100;
  static MAX_COLUMN_VALUE = 100;
  static MIN_ROW_VALUE = -100;
  static MAX_ROW_VALUE = 100;

  //error messages
  static EMPTY_ERROR_MESSAGE = "Please fill out this field.";
  static NOT_INTEGER_ERROR_MESSAGE = "Please enter a valid integer.";
  static NOT_IN_RANGE_ERROR_MESSAGE = `Value must be between ${CONSTANTS.MIN_ROW_VALUE} and ${CONSTANTS.MAX_ROW_VALUE}`;
}

// Using this class we can have our object that is constructed using min and columns, min and max rows
class Multiplication_Table {
  // a constructor that has four parmeters min and max columns
  //once we gell the four parmeters we calculate the size of the row and column
  //Finally we fill our matrix with data based on the four parameters
  //to generate data for the matrix,we use populate_matrix function
  constructor(min_column, max_column, min_row, max_row) {
    // Swap min_column and max_column if needed
    if (min_column > max_column)
      [min_column, max_column] = [max_column, min_column];

    // Swap min_row and max_row if needed
    if (min_row > max_row) [min_row, max_row] = [max_row, min_row];

    this.min_column = min_column;
    this.max_column = max_column;
    this.min_row = min_row;
    this.max_row = max_row;
    this.row_size = this.max_row - this.min_row + 1;
    this.column_size = this.max_column - this.min_column + 2;
    this.matrix = this.populate_matrix();
  }
  //this function will return the multiolication table which is a 2d array
  populate_matrix() {
    let matrix = [];
    //create header row
    let header_row = [];
    //matrix[0][0] is the sign of multiplication X
    header_row.push("X");
    //fill the first row with column values from min to max
    for (let j = this.min_column; j <= this.max_column; j++) {
      header_row.push(j);
    }
    //push the first row with column values from max to min
    matrix.push(header_row);

    //we fill out the rest of rows by multiplying each column by the first column in the same row
    //we do the same for all the rows from min to max values
    //once we fill the rows we push it back into the matrix
    for (let i = this.min_row; i <= this.max_row; i++) {
      let row = [];
      row.push(i);
      for (let j = this.min_column; j <= this.max_column; j++) {
        row.push(i * j);
      }
      matrix.push(row);
    }
    //we return the 2d matrix
    return matrix;
  }

  // a function to display the multiplcation table into the console for testing purpuses
  print_matrix() {
    let r = this.row_size;
    let c = this.column_size;
    console.log(r);
    console.log(c);
    for (let i = 0; i < this.row_size; i++) {
      let rowOutput = ""; // Reset for each row
      for (let j = 0; j < this.column_size; j++) {
        rowOutput += `${this.matrix[i][j]} \t`; // Access matrix
      }
      console.log(rowOutput.trim()); // Trim and print the row
    }
  }
  //a getter for the matrix
  get_matrix() {
    return this.matrix;
  }
}

//a class only for UI that has two static methods
class HTML_DISPLAY {
  //onstructs an HTML table from a 2D array (matrix), using the first row as the table header
  //and alternating row styles with CSS classes for each row. The first column in each row
  //is used as a header cell, creating a structured and styled table.
  //Begin with an empty HTML string and add the `<table>` opening tag.
  //Loop through each row of the `matrix`:
  //If it’s the first row (header row):
  //Open `<thead><tr>`.
  //Loop through each cell in the header row, wrapping each cell in `<th>` tags.
  //Close `</tr></thead>` and open `<tbody>` for the main content rows.
  //For all other rows:
  //Determine a CSS class based on the row index (even/odd for alternate styling).
  //Add a new `<tr>` with the CSS class.
  //For each cell in the row:
  //If it’s the first cell, wrap it in `<th>` to designate it as a row header.
  //Otherwise, wrap each cell in `<td>`.
  //Close the `<tr>` tag for the row.
  //Close the `</tbody></table>` tags.
  //Return the constructed HTML string.

  static construct_table(matrix) {
    let html = "";
    html += "<table>";

    for (let i = 0; i < matrix.length; i++) {
      // If it's the first row, treat it as a header
      if (i === 0) {
        html += "<thead><tr>";
        for (let j = 0; j < matrix[i].length; j++) {
          html += `<th>${matrix[i][j]}</th>`;
        }
        html += "</tr></thead><tbody>";
      } else {
        // Add class based on the row index for alternation
        const rowClass = i % 2 === 0 ? "even-row" : "odd-row";
        html += `<tr class="${rowClass}">`; // Add the row with the class
        for (let j = 0; j < matrix[i].length; j++) {
          if (j === 0) {
            // First column as header
            html += `<th>${matrix[i][j]}</th>`;
          } else {
            html += `<td>${matrix[i][j]}</td>`;
          }
        }
        html += "</tr>";
      }
    }

    html += "</tbody></table>";
    return html;
  }

  //Checks if the container element is valid:
  //If `container` is `null` or `undefined`, logs an error message to the console
  //and exits the function to prevent further execution.
  //If the container is valid, sets its `innerHTML` property to `html_content`,
  //effectively updating the container’s displayed content with the provided HTML.

  static display_content(container, html_content) {
    if (!container) {
      console.error("Container not found");
      return;
    }
    container.innerHTML = html_content;
  }
}

// Add a custom validation method for integer validation
$.validator.addMethod("integer", function (value, element) {
  return /^-?\d+$/.test(value); // // Regular expression to allow both positive and negative integers
});

$(document).ready(function () {
  let open_tabs = []; // Array to keep track of open tabs

    // Function to update the tabs list on the main page
  function update_tabs_list() {
    const tabs_list = $("#tabs-list");
    tabs_list.empty(); // Clear the current list
    // Iterate over open tabs and create a list item for each
    open_tabs.forEach((entry, index) => {
      if (entry && entry.tab && !entry.tab.closed) {
        const { min_col, max_col, min_row, max_row } = entry.meta || {};
        tabs_list.append(`
                    <li style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" class="tab-checkbox" data-index="${index}">
                        <span>Tab ${index + 1}: Columns (${min_col || "?"}-${
          max_col || "?"
        }), Rows (${min_row || "?"}-${max_row || "?"})</span>
                    </li>
                `);// Add each tab as a checkbox list item
      }
    });
  }
  // Function to periodically check for closed tabs
  function check_closed_tabs() {
    setInterval(() => {
      const initial_length = open_tabs.length;
      open_tabs = open_tabs.filter((entry) => entry.tab && !entry.tab.closed);
      if (open_tabs.length !== initial_length) {
        update_tabs_list(); // Update the list if there are changes
      }
    }, 1000); // Check every 1 second
  }

  // Start checking for closed tabs
  check_closed_tabs();
  
  // Close selected tabs when "Close Selected" button is clicked
  $("#close-selected-btn").click(function () {
    $(".tab-checkbox:checked").each(function () {
      const index = $(this).data("index");
      const tab_entry = open_tabs[index];
      if (tab_entry && tab_entry.tab && !tab_entry.tab.closed) {
        tab_entry.tab.close(); // Close the tab
      }
    });
    // Remove references to closed tabs
    open_tabs = open_tabs.filter((entry) => entry.tab && !entry.tab.closed); // Remove closed tabs
    update_tabs_list(); // Refresh the tabs list
  });

  $("#close-all-btn").click(function () {
    open_tabs.forEach((entry) => {
      if (entry.tab && !entry.tab.closed) {
        entry.tab.close(); // Close all tabs
      }
    });
    open_tabs = []; // Clear the array
    update_tabs_list(); // Refresh the tabs list
  });

  // Initialize jQuery Validation for the form with ID 'form'
  $("#form").validate({
    // Define validation rules for each input field
    rules: {
      minColumn: {
        required: true, // Field is required
        integer: true, // Must be an integer (custom validation method)
        range: [CONSTANTS.MIN_COLUMN_VALUE, CONSTANTS.MAX_COLUMN_VALUE], // Must be within the specified range
      },
      maxColumn: {
        required: true,
        integer: true,
        range: [CONSTANTS.MIN_COLUMN_VALUE, CONSTANTS.MAX_COLUMN_VALUE],
      },
      minRow: {
        required: true,
        integer: true,
        range: [CONSTANTS.MIN_ROW_VALUE, CONSTANTS.MAX_ROW_VALUE],
      },
      maxRow: {
        required: true,
        integer: true,
        range: [CONSTANTS.MIN_ROW_VALUE, CONSTANTS.MAX_ROW_VALUE],
      },
    },
    // Custom error messages for each field
    messages: {
      minColumn: {
        required: CONSTANTS.EMPTY_ERROR_MESSAGE, // Error message for empty field
        integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE, // Error message for non-integer value
        range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE, // Error message for out-of-range value
      },
      maxColumn: {
        required: CONSTANTS.EMPTY_ERROR_MESSAGE,
        integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE,
        range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE,
      },
      minRow: {
        required: CONSTANTS.EMPTY_ERROR_MESSAGE,
        integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE,
        range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE,
      },
      maxRow: {
        required: CONSTANTS.EMPTY_ERROR_MESSAGE,
        integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE,
        range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE,
      },
    },
    // Add styling to invalid fields
    highlight: function (element) {
      $(element).addClass("invalid-input"); // Adds .invalid-input styling to invalid fields
    },
    // Remove styling from valid fields
    unhighlight: function (element) {
      $(element).removeClass("invalid-input"); // Removes .invalid-input styling when valid
    },
  });

  // Generate button action
  $("#generate-btn").click(function () {
    // Parse the values from the input fields
    let min_col_value = parseInt($("#min-column").val(), 10);
    let max_col_value = parseInt($("#max-column").val(), 10);
    let min_row_value = parseInt($("#min-row").val(), 10);
    let max_row_value = parseInt($("#max-row").val(), 10);

    // Check if the form is valid
    if ($("#form").valid()) {
      // Create the multiplication table
      const multiplication_table = new Multiplication_Table(
        min_col_value,
        max_col_value,
        min_row_value,
        max_row_value
      );
      const table_html = HTML_DISPLAY.construct_table(
        multiplication_table.get_matrix()
      );
      // Swap column values if necessary
      if (min_col_value > max_col_value)
        [min_col_value, max_col_value] = [max_col_value, min_col_value];

      // Swap row values if necessary
      if (min_row_value > max_row_value)
        [min_row_value, max_row_value] = [max_row_value, min_row_value];

      // Open a new tab and write the table to it
      const new_tab = window.open();
      new_tab.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Multiplication Table (${min_col_value}-${max_col_value}) (${min_row_value}-${max_row_value})</title>
                    <link rel="stylesheet" href="./css/style.css">
                </head>
                <body>
                    <button class="close-tab" onclick="window.close()" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="close-icon">
                            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <h1>Multiplication Table</h1>
                    <h3>Generated Table for Columns (${min_col_value}-${max_col_value}) and Rows (${min_row_value}-${max_row_value})</h3>
                    ${table_html}
                </body>
                </html>
            `);

      new_tab.document.close(); // Close the document stream
      // Add the new tab reference to the array
      open_tabs.push({
        tab: new_tab,
        meta: {
          min_col: min_col_value,
          max_col: max_col_value,
          min_row: min_row_value,
          max_row: max_row_value,
        },
      });
      update_tabs_list(); // Refresh the tabs list
    } else {
      console.log("Form is not valid.");
    }
    update_tabs_list(); // Refresh the list to show the newly added tab
  });
});

$(function () {
  // Initialize sliders and bind to inputs
  $("#slider-min-column").slider({
    min: CONSTANTS.MIN_COLUMN_VALUE,
    max: CONSTANTS.MAX_COLUMN_VALUE,
    value: 0,
    slide: function (event, ui) {
      $("#min-column").val(ui.value);
      update_table();
    },
    change: function () {
      update_table();
    },
  });

  $("#slider-max-column").slider({
    min: CONSTANTS.MIN_COLUMN_VALUE,
    max: CONSTANTS.MAX_COLUMN_VALUE,
    value: 0,
    slide: function (event, ui) {
      $("#max-column").val(ui.value);
      update_table();
    },
    change: function () {
      update_table();
    },
  });

  $("#slider-min-row").slider({
    min: CONSTANTS.MIN_ROW_VALUE,
    max: CONSTANTS.MAX_ROW_VALUE,
    value: 0,
    slide: function (event, ui) {
      $("#min-row").val(ui.value);
      update_table();
    },
    change: function () {
      update_table();
    },
  });

  $("#slider-max-row").slider({
    min: CONSTANTS.MIN_ROW_VALUE,
    max: CONSTANTS.MAX_ROW_VALUE,
    value: 0,
    slide: function (event, ui) {
      $("#max-row").val(ui.value);
      update_table();
    },
    change: function () {
      update_table();
    },
  });

  // Sync text inputs with sliders
  $("#min-column").on("input", function () {
    $("#slider-min-column").slider("value", $(this).val());
    update_table();
  });
  $("#max-column").on("input", function () {
    $("#slider-max-column").slider("value", $(this).val());
    update_table();
  });
  $("#min-row").on("input", function () {
    $("#slider-min-row").slider("value", $(this).val());
    update_table();
  });
  $("#max-row").on("input", function () {
    $("#slider-max-row").slider("value", $(this).val());
    update_table();
  });

  // Function to dynamically update the multiplication table
  function update_table() {
    const min_column = parseInt($("#min-column").val(), 10);
    const max_column = parseInt($("#max-column").val(), 10);
    const min_row = parseInt($("#min-row").val(), 10);
    const max_row = parseInt($("#max-row").val(), 10);

    // Generate and display the multiplication table
    const multiplication_table = new Multiplication_Table(
      min_column,
      max_column,
      min_row,
      max_row
    );
    HTML_DISPLAY.display_content(
      document.getElementById("container-table"),
      HTML_DISPLAY.construct_table(multiplication_table.get_matrix())
    );
  }

  // Set default values for inputs
  $("#min-column").val(1);
  $("#max-column").val(1);
  $("#min-row").val(1);
  $("#max-row").val(1);

  // Initialize the table on page load
  update_table();
});

// Sources :
//I used the sources provided by the professor in the hw4 pdf posted on blackboard
//Two chapters of Dan Wellman’s book on the jQuery UI library
//https://jqueryvalidation.org/documentation/
