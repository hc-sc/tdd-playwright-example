

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
  await setForm();
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

async function setForm() {
  const form = document.getElementById('form');
  form.addEventListener('submit', submitInstead);

  const idInputField = document.getElementById("id");
  const nameInputField = document.getElementById("name");
  const roleInputField = document.getElementById("role");


  // Inputted ID must be greater than 0.
  await setFormInputFilter(idInputField, function (value) {
    return /^\d*$/.test(value);
  });

  // Inputted NAME must only be alpha
  await setFormInputFilter(nameInputField, function (value) {
    return /^[-a-z\s]*$/i.test(value);
  });


  // Inputted ROLE must only be alpha
  await setFormInputFilter(roleInputField, function (value) {
    return /^[-a-z\s]*$/i.test(value);
  });

  nameInputField.addEventListener('blur', scrubText);
  roleInputField.addEventListener('blur', scrubText);

  inputRequiredHandler();

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

    case "GET":

      id.required = false;
      name.required = false;
      role.required = false;

      id.disabled = id.required;
      name.disabled = !name.required;
      role.disabled = !role.required;

      break;

    case "POST":

      id.required = false;
      name.required = true;
      role.required = true;

      id.disabled = !id.required;
      name.disabled = !name.required;
      role.disabled = !role.required;

      break;

    case "PUT":

      id.required = true;
      name.required = true;
      role.required = true;

      id.disabled = !id.required;
      name.disabled = !name.required;
      role.disabled = !role.required;

      break;

    case "DELETE":

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

function scrubText() {
  this.value = this.value.replace(/\b./g, c => c.toUpperCase()).trim();
}

async function submitInstead(event) {
  event.preventDefault();
  await requestHandler();
}


// ------------ End of: Initiialization ------------//

// ------------ Start of: Submitting Form ------------//

async function requestHandler() {
  const request = document.getElementById('request').value;
  const id = document.getElementById('id').value;
  const name = document.getElementById('name').value;
  const role = document.getElementById('role').value;

  console.debug("REQUEST HANDLER RUNNING: " + request + " " + id + " " + name + " " + role);

  let formMethod;
  let serverEndpoint = "/employees";

  let clientEndpoint = "/employees";
  let body;
  let response;
  let tableFiller;


  try {
    switch (request) {

      case "GET":
        formMethod = request;
        if (id === "" || id === "/employees") {
          tableFiller = "MANY";
        } else {
          serverEndpoint = serverEndpoint.concat("/" + id);
          tableFiller = "ONE";
        }
        clientEndpoint = serverEndpoint;
        break;

      case "POST": //TODO: Post /bulk

        formMethod = request;
        serverEndpoint = serverEndpoint.concat("/add");

        body = bodyBuilder(undefined, name, role)
        tableFiller = "ONE";
        id = undefined;
        break;

      case "PUT":



        formMethod = "POST"; // Form only supports GET or POST. Controller maps to proper API methods.

        serverEndpoint = serverEndpoint.concat("/update");

        clientEndpoint = clientEndpoint.concat("/" + id);
        body = bodyBuilder(id, name, role)
        tableFiller = "ONE";
        break;

      case "DELETE":



        formMethod = "POST"; // Form only supports GET or POST. Controller maps to proper API methods.
        serverEndpoint = serverEndpoint.concat("/delete");

        clientEndpoint = clientEndpoint.concat("/" + id);
        tableFiller = "ONE";
        break;
      default:
        break;
    }
  } catch (err) {
    throw err;
  } finally {

    console.debug("REQUEST: " + request + " ID: " + id + " BODY: " + body + " FILLER: " + tableFiller + " SERVER ENDPOINT: " + serverEndpoint + " CLIENT ENDPOINT: " + clientEndpoint);
    switch (await document.getElementById('request-side').value) {

      case "CLIENT":
        response = await fetchBodyRequest(request, backend.concat(clientEndpoint), body);
        await tableHandler(response, tableFiller);
        break;
      case "SERVER":
        const form = document.getElementById("form");
        form.setAttribute("method", formMethod);
        form.setAttribute("action", serverEndpoint);
        form.submit();
        // await sendForm(request, id, name, role, endpoint);
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
    case "ONE":
      await oneItemTable(response);
      break;
    case "MANY":
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
    alertLang("Invalid fields or employee not found.", "Champs non valides ou employé introuvable.");
    return;
  }
  const row = document.createElement("tr");
  console.debug(employees);
  for (let key of Object.keys(employees)) {
    const td = document.createElement("td");
    td.textContent = employees[key];
    row.appendChild(td);
  }
  table.appendChild(row);
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
  switch (document.documentElement.lang) {
    case "en":
      alert(english);
      break;
    case "fr":
      alert(french)
      break;
    default:
      alert("[FR]" + english);
  }
}

// ---------------- End of: Util Methods ---------------- //






