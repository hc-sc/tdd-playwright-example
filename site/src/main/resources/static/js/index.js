// var apiURL = "https://localhost:9443/employees";
// var siteURL = "https://localhost:8443/employees";
const apiURL = "https://tdd-playwright-example-api.herokuapp.com/employees"
const siteURL = "https://tdd-playwright-example-server.herokuapp.com/employees"

async function submitInstead(event) {
  event.preventDefault();
  await getData();
}

function setup() {
  const clientForm = document.getElementById('form');
  clientForm.addEventListener('submit', submitInstead);
  debugCache();
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

async function getData() {
  const request = document.getElementById('request').value;
  const id = document.getElementById('id').value;
  const name = document.getElementById('name').value;
  const role = document.getElementById('role').value;
  requestHandler(request, id, name, role);
}

async function requestHandler(request, id, name, role) {
  console.debug("REQUEST HANDLER RUNNING: " + request + " " + id + " " + name + " " + role);
  let endpoint;
  let response;
  let tableFiller;
  try {

    switch (request) {
      case "GET":
        if (id === "") {
          endpoint = "";
          tableFiller = "MANY";
        } else {
          endpoint = "/" + id;
          tableFiller = "ONE";
        }
        response = await fetchRequest(request, apiURL + endpoint);
        console.debug(tableFiller);
        // await cacheAndGo(await fetchRequest(request, apiURL + endpoint), endpoint, tableFiller);
        break;
      case "POST":
        endpoint = "";
        response = await fetchRequest(request, apiURL + endpoint, bodyBuilder(undefined, name, role));
        tablefiller = "ONE";
        // await cacheAndGo(await fetchRequest(request, apiURL + endpoint, bodyBuilder(undefined, name, role)), endpoint, "ONE");

        // TODO: elseif for posting many -> new bodyBuilder to handle list of DTO items
        //  } else {
        //  endpoint = "/bulk";
        //  response = await fetchRequest(request, apiURL + endpoint, bodyBuilder(undefined, name, role));
        //  tablefiller = "MANY";
        // }
        break;
      case "DELETE":
        endpoint = "/" + id;
        response = await fetchRequest(request, apiURL + endpoint)
        tablefiller = "ONE";
        // await cacheAndGo(await fetchRequest(request, apiURL + endpoint), endpoint, "ONE");
        break;
      case "PUT":
        endpoint = "/" + id;
        response = await fetchRequest(request, apiURL + endpoint, bodyBuilder(undefined, name, role));
        tablefiller = "ONE";
        // await cacheAndGo(await fetchRequest(request, apiURL + endpoint, bodyBuilder(id, name, role)), endpoint, "ONE");
        break;
      default:
        break;
    }
  } catch (err) {
    throw err;
  } finally {
    switch (await document.getElementById('request-side').value) {
      case "CLIENT":
        await tableHandler(response, tableFiller);
        break;
      case "SERVER":
        window.location.replace(siteURL + endpoint);
        break;
    }
  }
}




// ---------------- Client Table Methods ----------------//

async function tableHandler(response, tableFiller) {
  console.debug("TABLE HANDLER: ");
  debugCache();
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

// async function tableHandler() {
//   const response = JSON.parse(sessionStorage.getItem('response'));
//   const tableFiller = sessionStorage.getItem('filler');
//   console.debug("TABLE HANDLER: ");
//   debugCache();
//   switch (tableFiller) {
//     case "ONE":
//       await oneItemTable(response);
//       break;
//     case "MANY":
//       await manyItemTable(response);
//       break;
//     default:
//       break;
//   }
// }

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
  console.debug("FILLING MANY TABLE:");
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

// async function cacheAndGo(response, endpoint, tableType) {
//   console.debug("CACHE AND GO");
//   debugCache();
//   if (!errorItem(response)) {
//     sessionStorage.setItem("filler", tableType);
//     window.location.replace(siteURL + endpoint);
//   } else {
//     alert("Input invalid");
//   }
// }

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

async function fetchRequest(request, endpoint, data) {
  console.debug("DATA: " + JSON.stringify(data));
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

function clearCache() {
  sessionStorage.removeItem('response');
  sessionStorage.removeItem('filler');
}
function debugCache() {
  console.debug("CACHE: response - " + sessionStorage.getItem('response') + ", tableFillerType - " + sessionStorage.getItem('filler'));
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