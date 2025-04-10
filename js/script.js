// Global variables
let list = [];
let dataType = "string"; // default type is string

// Update data type based on radio buttons
document.getElementsByName("dataType").forEach(radio => {
  radio.addEventListener("change", function() {
    dataType = this.value;
    appendOutput("Data type switched to: " + dataType);
  });
});

// Helper function to print list without square brackets
function printList(listArray) {
  return listArray.join(" ");
}

// Append text to output (with new line)
function appendOutput(text) {
  const outDiv = document.getElementById("output");
  outDiv.textContent += text + "\n";
}

// Clear output
function clearOutput() {
  document.getElementById("output").textContent = "";
}

// Create initial list using user input from initInput
document.getElementById("initButton").addEventListener("click", function() {
  const initText = document.getElementById("initInput").value;
  if (initText.trim() === "") {
    alert("Please enter some elements separated by commas.");
    return;
  }
  let elements = initText.split(",").map(el => el.trim());
  // If number mode, convert strings to numbers
  if (dataType === "number") {
    elements = elements.map(el => Number(el));
  }
  list = elements;
  document.getElementById("opsSection").style.display = "block";
  appendOutput("Initial list created: " + printList(list));
});

// Show dynamic panel for operations that need extra input
function showDynamicOps(labelText, placeholder1, placeholder2, callback) {
  document.getElementById("dynamicLabel").textContent = labelText;
  document.getElementById("dynamicInput1").placeholder = placeholder1;
  if (placeholder2) {
    document.getElementById("dynamicInput2").placeholder = placeholder2;
    document.getElementById("dynamicInput2").style.display = "block";
  } else {
    document.getElementById("dynamicInput2").style.display = "none";
  }
  document.getElementById("dynamicOps").style.display = "block";
  document.getElementById("dynamicSubmit").onclick = function() {
    const val1 = document.getElementById("dynamicInput1").value;
    const val2 = document.getElementById("dynamicInput2").value;
    callback(val1, val2);
    hideDynamicOps();
  };
}

function hideDynamicOps() {
  document.getElementById("dynamicOps").style.display = "none";
  document.getElementById("dynamicInput1").value = "";
  document.getElementById("dynamicInput2").value = "";
}

// Operation implementations

// Insert element at index
function showInsert() {
  showDynamicOps("Insert: enter index and element (comma-separated)", "e.g., 2", "e.g., NewElement", function(input, unused) {
    const parts = input.split(",");
    if (parts.length < 2) {
      appendOutput("Invalid input for insertion.");
      return;
    }
    let index = Number(parts[0].trim());
    let element = parts[1].trim();
    if (dataType === "number") {
      element = Number(element);
    }
    if (isNaN(index) || index < 0 || index > list.length) {
      appendOutput("Invalid index for insertion.");
      return;
    }
    list.splice(index, 0, element);
    appendOutput("After insertion: " + printList(list));
  });
}

// Replace element at a specified index
function showReplaceByIndex() {
  showDynamicOps("Replace by Index: enter index and new element (comma-separated)", "e.g., 1", "e.g., NewElement", function(input, unused) {
    const parts = input.split(",");
    if (parts.length < 2) {
      appendOutput("Invalid input for replacement.");
      return;
    }
    let index = Number(parts[0].trim());
    let newElement = parts[1].trim();
    if (dataType === "number") {
      newElement = Number(newElement);
    }
    if (isNaN(index) || index < 0 || index >= list.length) {
      appendOutput("Invalid index for replacement.");
      return;
    }
    list[index] = newElement;
    appendOutput("After replacement: " + printList(list));
  });
}

// Remove element at a specified index
function showRemoveByIndex() {
  showDynamicOps("Remove by Index: enter index to remove", "e.g., 2", null, function(input, unused) {
    let index = Number(input.trim());
    if (isNaN(index) || index < 0 || index >= list.length) {
      appendOutput("Invalid index for removal.");
      return;
    }
    list.splice(index, 1);
    appendOutput("After removal: " + printList(list));
  });
}

// Search for an element by value (case-insensitive for strings)
function showSearch() {
  showDynamicOps("Search: enter value to search for", "Value", null, function(input, unused) {
    const searchValue = input.trim();
    let foundIndices = [];
    list.forEach((val, idx) => {
      if (dataType === "string") {
        if (String(val).toLowerCase() === searchValue.toLowerCase()) {
          foundIndices.push(idx);
        }
      } else {
        if (val === Number(searchValue)) {
          foundIndices.push(idx);
        }
      }
    });
    if (foundIndices.length === 0) {
      appendOutput("Search: Element not found.");
    } else {
      appendOutput("Search: Found at indices: " + foundIndices.join(", "));
    }
  });
}

// Update an element by value (replace all occurrences, case-insensitive for strings)
function showUpdateByValue() {
  showDynamicOps("Update by Value: enter old and new value (comma-separated)", "e.g., oldVal", "e.g., newVal", function(input, unused) {
    const parts = input.split(",");
    if (parts.length < 2) {
      appendOutput("Invalid input for update.");
      return;
    }
    const oldVal = parts[0].trim();
    let newVal = parts[1].trim();
    if (dataType === "number") {
      newVal = Number(newVal);
    }
    let updated = false;
    for (let i = 0; i < list.length; i++) {
      if (dataType === "string") {
        if (String(list[i]).toLowerCase() === oldVal.toLowerCase()) {
          list[i] = newVal;
          updated = true;
        }
      } else {
        if (list[i] === Number(oldVal)) {
          list[i] = newVal;
          updated = true;
        }
      }
    }
    if (updated) {
      appendOutput("After update: " + printList(list));
    } else {
      appendOutput("Update: Element not found.");
    }
  });
}

// Sort list (lexicographically for strings, numerically for numbers)
function sortList() {
  if (dataType === "string") {
    list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  } else {
    list.sort((a, b) => a - b);
  }
  appendOutput("After sorting: " + printList(list));
}

// Reverse list
function reverseList() {
  list.reverse();
  appendOutput("After reversing: " + printList(list));
}

// Traverse forward
function traverseForward() {
  let out = "Forward traversal:\n";
  for (let i = 0; i < list.length; i++) {
    out += "Index " + i + ": " + list[i] + "\n";
  }
  appendOutput(out);
}

// Traverse backward
function traverseBackward() {
  let out = "Backward traversal:\n";
  for (let i = list.length - 1; i >= 0; i--) {
    out += "Index " + i + ": " + list[i] + "\n";
  }
  appendOutput(out);
}

// For buttons on the operations section, map to functions
// (For example, if you have a button "Display List", its onclick calls displayList(), etc.)
