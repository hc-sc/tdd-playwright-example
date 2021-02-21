var host;
var backend;

// const backend = "https://tdd-playwright-example-api.herokuapp.com/employees"
// const host = "https://tdd-playwright-example-server.herokuapp.com/employees"

async function submitInstead(event) {
  event.preventDefault();
  await parseFormQuery();
}

function setup() {
  setURL();
  const form = document.getElementById('form');
  form.addEventListener('submit', submitInstead);
}

// Populates client table once
(async () => {
  try {
    setup();
    // await tableHandler();
    // await form();
  } catch (err) {
    throw err;
  }
})();

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

async function parseFormQuery() {
  const request = document.getElementById('request').value;
  const id = document.getElementById('id').value;
  const name = document.getElementById('name').value;
  const role = document.getElementById('role').value;
  requestHandler(request, id, name, role);
}

async function requestHandler(request, id, name, role) {
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
        if (name === "" || role === "") { return; }
        serverEndpoint = serverEndpoint.concat("/add");

        body = bodyBuilder(undefined, name, role)
        tableFiller = "ONE";
        id = undefined;
        break;

      case "PUT":
        formMethod = "POST"; // Form only supports GET or POST. Controller maps to proper API methods.
        if (id == "" || name == "" || role == "") { return; }
        serverEndpoint = serverEndpoint.concat("/update");

        clientEndpoint = clientEndpoint.concat("/" + id);
        body = bodyBuilder(id, name, role)
        tableFiller = "ONE";
        break;

      case "DELETE":
        formMethod = "POST"; // Form only supports GET or POST. Controller maps to proper API methods.
        if (id == "") { return; }
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
        response = await fetchBodyRequest(request, backend + clientEndpoint, body);
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




// ---------------- Client Table Methods ----------------//

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
    alert("Invalid Fields or employee not found");
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


// ---------------- Sequence Methods ----------------//

//https://www.geeksforgeeks.org/how-to-create-a-form-dynamically-with-the-javascript/
function createFormInput(form, name, value) {
  if (value === undefined || value === null || value == "") return;
  const attribute = document.createElement("input");
  attribute.setAttribute("type", "text");
  attribute.setAttribute("name", name);
  attribute.setAttribute("value", value);
  form.appendChild(attribute);
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

// ---------------- Util Methods ----------------//

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


// ---------------- Input Validation ----------------//

function validatorHandler(id, name, role) {
  return (
    inputValidator(new RegExp('/^\d+$/'), id, "ID") ||
    inputValidator(new RegExp("^[a-zA-Z]+$"), name, "Name") ||
    inputValidator(new RegExp("^[a-zA-Z]+$"), role, "Role"))
}

function inputValidator(pattern, input, inputName) {
  if (pattern.test(input.replace(/\s/g, ''))) {
    alert(inputName + ": " + input + " is not a valid input.");
    return false;
  }
  return true;
}