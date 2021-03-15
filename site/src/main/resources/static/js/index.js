const TableIconEnum = Object.freeze({ "EDIT": "fa fa-edit", "SAVE": "fa fa-save", "DELETE": "far fa-trash-alt" })
const ButtonTypeEnum = Object.freeze({ "SUBMIT": "submit", "EDIT": "edit", "DELETE": "delete" })
const RequestEnum = Object.freeze({ "SERVER": "server", "CLIENT": "client", "GET": "GET", "POST": "POST", "PUT": "PUT", "DELETE": "DELETE" })
const TableFillerEnum = Object.freeze({ "ONE": "ONE", "MANY": "MANY" })
// ------------ Start of: Initiialization ------------//
var host;
var backend;

(async () => {
  try {
    await initialization();
  } catch (err) {
    throw err;
  }
})();

async function initialization() {
  setURL();
  await setAlertNotice();
  await setForm();
  await setTableRows();

}

function setURL() { // For now
  host = window.location.host;
  console.debug(host);
  switch (host) {
    case ("localhost:8443"):
      backend = "https://localhost:9443";
      break;
    case ("tdd-playwright-example-server.herokuapp.com"):
      backend = "https://tdd-playwright-example-api.herokuapp.com";
      break;
    default:
      backend = "https://localhost:9443";
  }

}

async function setAlertNotice() {
  const alert = document.getElementById('alert');
  alert.hidden = alert.childNodes.length <= 3;
}

async function setForm() {
  const form = document.getElementById('form');

  if (form === undefined || form === null) { return }



  form.addEventListener('submit', submitInstead);

  const idInputField = document.getElementById("id");
  const nameInputField = document.getElementById("name");
  const roleInputField = document.getElementById("role");


  // Inputted ID must be greater than 0.
  await setFormInputFilter(idInputField, function (value) {
    return /^((?!(0))[0-9]*)$/.test(value);
  });

  // Inputted NAME must only be alpha
  await setFormInputFilter(nameInputField, function (value) {
    return /^[-a-z\s]*$/i.test(value);
  });


  // Inputted ROLE must only be alpha
  await setFormInputFilter(roleInputField, function (value) {
    return /^[-a-z\s]*$/i.test(value);
  });

  idInputField.addEventListener('blur', scrubText);
  nameInputField.addEventListener('blur', scrubText);
  roleInputField.addEventListener('blur', scrubText);

  inputRequiredHandler();

}

function setTableRows() {

  const rows = document.querySelectorAll(".table-row");

  rows.forEach(function (row) {
    const id = document.querySelector("#server-side-employees > tbody:nth-child(2) > tr:nth-child(" + row.rowIndex + ") > td:nth-child(1)");
    const name = document.querySelector("#server-side-employees > tbody:nth-child(2) > tr:nth-child(" + row.rowIndex + ") > td:nth-child(2)");
    const role = document.querySelector("#server-side-employees > tbody:nth-child(2) > tr:nth-child(" + row.rowIndex + ") > td:nth-child(3)");
    const comment = document.querySelector("#server-side-employees > tbody:nth-child(2) > tr:nth-child(" + row.rowIndex + ") > td:nth-child(4)");

    row.setAttribute("id", `server-row-${row.rowIndex}`)
    id.setAttribute("id", "server-id-" + row.rowIndex);
    name.setAttribute("id", "server-name-" + row.rowIndex);
    role.setAttribute("id", "server-role-" + row.rowIndex);
    comment.setAttribute("id", "server-comment-" + row.rowIndex);
    buttonRowGenerator(row, RequestEnum.SERVER);

    row.addEventListener("click", function () { clickRowListener(row, RequestEnum.SERVER) });

  })
}

function clickRowListener(row, requestSide) {
  // const buttonSelector = `#${requestSide}-${TableIconEnum.EDIT}-${row.rowIndex}`;
  const buttonSelector = `#${requestSide}-edit-${row.rowIndex} > i:nth-child(1)`;
  // printChildNodeTree(this);
  console.debug("BUTTON: " + document.querySelector(buttonSelector).getAttribute("class"));

  if (document.querySelector(buttonSelector).getAttribute("class") !== TableIconEnum.SAVE) {

    const id = document.querySelector(`#${requestSide}-id-${row.rowIndex}`).textContent;
    const name = document.querySelector(`#${requestSide}-name-${row.rowIndex}`).textContent;
    const role = document.querySelector(`#${requestSide}-role-${row.rowIndex}`).textContent;
    const comment = document.querySelector(`#${requestSide}-comment-${row.rowIndex}`).textContent;

    if (requestSide === RequestEnum.SERVER) {

      window.location = `/employees/${id}`;

    } else {
      window.location = `/inspect?id=${id}&name=${name}&role=${role}&comment=${comment}`;
    }
  }
}

/**
 * Helper method to see parent/child css heirarchy
 * @param {} parent 
 */
function printChildNodeTree(e) {
  if (e.hasChildNodes) {
    console.debug("\nNEW PARENT: ");
    printChildNodeTree(e.firstChild);
  }
  console.debug(e.innerHTML);
}



/**
 * Supports Copy+Paste, Drag+Drop, keyboard shortcuts, context menu operations, non-typeable keys,
 * the caret position, different keyboard layouts, and all browsers since IE 9.
 * @param {*} textbox 
 * @param {*} inputFilter 
 * @Author https://jsfiddle.net/emkey08/zgvtjc51
 */
async function setFormInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    textbox.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}


function inputRequiredHandler() {

  const request = document.getElementById("request");
  const id = document.getElementById("id");
  const name = document.getElementById("name");
  const role = document.getElementById("role");

  switch (request.value) {

    case RequestEnum.GET:

      id.required = false;
      name.required = false;
      role.required = false;

      id.disabled = id.required; // Empty ID gets all employees.
      name.disabled = !name.required;
      role.disabled = !role.required;

      break;

    case RequestEnum.POST:

      id.required = false;
      name.required = true;
      role.required = true;

      id.disabled = !id.required;
      name.disabled = !name.required;
      role.disabled = !role.required;

      break;

    case RequestEnum.PUT:

      id.required = true;
      name.required = true;
      role.required = true;

      id.disabled = !id.required;
      name.disabled = !name.required;
      role.disabled = !role.required;

      break;

    case RequestEnum.DELETE:

      id.required = true;
      name.required = false;
      role.required = false;

      id.disabled = !id.required;
      name.disabled = !name.required;
      role.disabled = !role.required;

      break;

    default:
      break;

  }

}

async function clearErrorNotices() {
  const alert = document.getElementById("alert")
  alert.hidden = true;
  while (alert.childNodes.length > 3) {
    console.debug("REMOVING:" + alert.childNodes[3]);
    alert.removeChild(alert.childNodes[3]);
  }
  console.debug(alert.childNodes.length);
}


async function addErrorMessage(message) {

  let li = document.createElement("li");
  li.textContent = message;

  let ul = document.getElementById("ul");
  if (ul === null || ul === undefined) {
    ul = document.createElement("ul");

  }
  ul.appendChild(li);
  document.getElementById("alert").appendChild(ul);

  await setAlertNotice();
}

async function submitInstead(event) {
  event.preventDefault();

  await clearErrorNotices();

  const requestSide = document.getElementById('request-side');
  const request = document.getElementById('request');
  const id = document.getElementById('id');
  const name = document.getElementById('name');
  const role = document.getElementById('role');

  id.disabled = false;
  name.disabled = false;
  role.disabled = false;

  await requestHandler(requestSide.value.toLowerCase(), request.value, id.value, name.value, role.value);
}


// ------------ End of: Initiialization ------------//

// ------------ Start of: Submitting Form ------------//

async function requestHandler(requestSide, request, id, name, role) {


  console.debug("REQUEST HANDLER RUNNING: " + request + " " + id + " " + name + " " + role);

  let clientEndpoint = "/employees";
  let body;
  let response;
  let tableFiller;


  try {
    switch (request) {

      case RequestEnum.GET:
        formMethod = request;
        if (id === "" || id === "/employees") {
          tableFiller = TableFillerEnum.MANY;
        } else {
          tableFiller = TableFillerEnum.ONE;
        }
        console.debug("FILLER: " + tableFiller);
        clientEndpoint = clientEndpoint.concat("/" + id);
        break;

      case RequestEnum.POST: //TODO: Post /bulk
        body = bodyBuilder(undefined, name, role)
        tableFiller = TableFillerEnum.ONE;
        id = undefined;
        break;

      case RequestEnum.PUT:
        clientEndpoint = clientEndpoint.concat("/" + id);
        body = bodyBuilder(id, name, role)
        tableFiller = TableFillerEnum.ONE;
        break;

      case RequestEnum.DELETE:
        clientEndpoint = clientEndpoint.concat("/" + id);
        tableFiller = TableFillerEnum.ONE;
        break;
      default:
        break;
    }
  } catch (err) {
    throw err;
  } finally {

    console.debug("REQUEST: " + request + " ID: " + id + " BODY: " + body + " FILLER: " + tableFiller + " CLIENT ENDPOINT: " + clientEndpoint);
    switch (requestSide) {

      case RequestEnum.CLIENT:
        response = await fetchBodyRequest(request, backend.concat(clientEndpoint), body);
        await tableHandler(response, tableFiller);

        break;
      case RequestEnum.SERVER:
        const form = document.getElementById("form");
        form.submit();
        break;
    }
  }
}

async function fetchRequest(request, endpoint) {
  const answer = await fetch(
    (endpoint),
    {
      method: request,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json())
    .catch((error) => {
      console.error("Error: ", error);
    });
  sessionStorage.setItem("response", JSON.stringify(answer));
  return answer;
}

async function fetchBodyRequest(request, endpoint, data) {
  if (data === undefined) return await fetchRequest(request, endpoint);

  const answer = await fetch(
    (endpoint),
    {
      method: request,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: data
    }).then((response) => response.json())
    .catch((error) => {
      console.error("Error: ", error);
    });
  sessionStorage.setItem("response", JSON.stringify(answer));
  return answer;
}

// ------------ End of: Preparing Form Submission ------------//


// ---------------- Start of: Client Table Methods ---------------- //

async function tableHandler(response, tableFiller) {
  console.debug("TABLE HANDLER: " + tableFiller);
  switch (tableFiller) {
    case TableFillerEnum.ONE:
      await oneItemTable(response);
      break;
    case TableFillerEnum.MANY:
      await manyItemTable(response);
      break;
    default: //alert based --> for DELETE requests
      break;
  }
}

async function newTable() {
  const table = document.querySelector("#js-employees > tbody")
  while (table.hasChildNodes()) {
    table.removeChild(table.childNodes[0]);
  }
  return table;
}

async function oneItemTable(employees) {
  console.debug("FILLING ONE TABLE:");
  await populateTable(await newTable(), employees);
};

async function manyItemTable(employeeList) {
  console.debug("FILLING MANY TABLE:" + JSON.stringify(employeeList));
  const table = await newTable();
  employeeList.employees.forEach((employee) => {
    populateTable(table, employee);
  });
};

async function populateTable(table, employees) {
  if (errorItem(employees)) {
    alertLang("Employee not found.", "Employé introuvable.");
    return;
  }
  const row = document.createElement("tr");
  row.setAttribute("class", "table-row");
  row.setAttribute("href-data", "www.google.com");
  row.addEventListener("click", function () { clickRowListener(row, RequestEnum.CLIENT) });

  table.appendChild(row);
  row.setAttribute("id", "row-" + row.rowIndex);

  console.debug(employees);
  for (let key of Object.keys(employees)) {
    const td = document.createElement("td");
    td.setAttribute("id", "client-" + key + "-" + row.rowIndex);
    td.textContent = employees[key];

    row.appendChild(td);
  }
  await buttonRowGenerator(row, RequestEnum.CLIENT);

  // setTableListener();
}

async function buttonRowGenerator(row, requestSide) {
  const td = document.createElement("td");
  td.setAttribute("id", `button-row-${row.rowIndex}-${requestSide.toLowerCase()}`);

  let button;

  button = buttonGenerator(row, ButtonTypeEnum.EDIT, requestSide);
  td.appendChild(button);

  button = buttonGenerator(row, ButtonTypeEnum.DELETE, requestSide);
  td.appendChild(button);

  row.appendChild(td);

}


function buttonGenerator(row, type, requestSide) {

  const button = document.createElement("button");
  const icon = document.createElement("i");

  const index = row.rowIndex;
  requestSide = requestSide.toLowerCase();
  button.setAttribute("id", requestSide + "-" + type.toLowerCase() + "-" + index);
  button.setAttribute("aria-label", `${type} row ${index} of ${requestSide.toLowerCase()} table.`);

  const name = document.getElementById(requestSide + "-name-" + index);
  const role = document.getElementById(requestSide + "-role-" + index);

  switch (type) {
    case ButtonTypeEnum.EDIT:

      type = TableIconEnum.EDIT;

      button.addEventListener('click', function (event) {
        event.stopPropagation();
        const lastState = button.firstChild.getAttribute("class");
        const newState = (lastState === TableIconEnum.EDIT) ? TableIconEnum.SAVE : TableIconEnum.EDIT;
        const editable = (newState === TableIconEnum.EDIT) ? "false" : "true";
        name.setAttribute("contenteditable", editable);
        role.setAttribute("contenteditable", editable);

        button.removeChild(button.firstChild);
        icon.setAttribute('class', newState);
        button.appendChild(icon);

        if (lastState === TableIconEnum.SAVE) {
          // TODO: validate and send PUT request with edited values.
        }



      });
      break;
    case ButtonTypeEnum.DELETE:

      type = TableIconEnum.DELETE;

      button.addEventListener('click', function (event) {
        event.stopPropagation();

        // TODO: Validate, send delete-request, delete row from table
      });
      break;
  }

  icon.setAttribute('class', type);
  button.appendChild(icon);
  return button;
}


async function deleteEmployee(row) {
  row.parentNode("tr").remove();


  // function removeParents(e, root) {
  //   root = root ? root : document.body;
  //       var p = e.parentNode;
  //       if (p !== root) {
  //       removeParents(p, root);
  //       }
  //   p.parentNode.removeChild(p) 

  //   }
}


// ---------------- End of: Client Table Methods ---------------- //


// ---------------- Start of: Util Methods ---------------- //


function bodyBuilder(id, name, role) {
  let body = ("{");

  if (id !== undefined) {
    body = body.concat("\"id\": \"" + id + "\",");
  }

  body = body.concat("\"name\": \"" + name + "\",");
  body = body.concat("\"role\": \"" + role + "\"");
  body = body.concat("}");
  return body;
}

function errorItem(response) {
  return (response.hasOwnProperty("error") || response.hasOwnProperty("errors"))
}


function alertLang(english, french) {
  // const alert = document.getElementById('alert');
  let message;
  switch (document.documentElement.lang) {
    case "en":
      // alert(english);
      message = english;
      break;
    case "fr":
      // alert(french)
      message = french;
      break;
    default:
      // alert("[FR]" + english);
      message = "[FR]" + english;
  }

  addErrorMessage(message);

}


function scrubText() {
  this.value = this.value.replace(/^0+\b./g, c => c.toUpperCase()).trim();
}

// ---------------- End of: Util Methods ---------------- //






