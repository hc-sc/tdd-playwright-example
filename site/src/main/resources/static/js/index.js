// // const baseURL = "${apiURL}" + "/" + "${endpoints.employees.en}";
// var baseURL = "https://localhost:9443/employees";
// var homeURL = "https://localhost:8443/employees";
const baseURL = "https://tdd-playwright-example-api.herokuapp.com/employees"
const homeURL = "https://tdd-playwright-example-server.herokuapp.com/employees"

async function submitInstead(event) {
  event.preventDefault();
  await getData();
}

function setup() {
  const form = document.getElementById('form');
  form.addEventListener('submit', submitInstead);
  debugCache();
}

// Populates client table once
(async () => {
  try {
    setup();
    await tableHandler();
  } catch (err) {
    throw err;
  }
})();

async function getData() {
  // clearCache();
  const request = document.getElementById('request').value;
  const id = document.getElementById('id').value;
  const name = document.getElementById('name').value;
  const role = document.getElementById('role').value;
  await requestHandler(request, id, name, role);
}

async function requestHandler(request, id, name, role) {
  console.debug("REQUEST HANDLER RUNNING: " + request + " " + id + " " + name + " " + role);
  try {
    let endpoint;
    // const response;
    switch (request) {
      case "GET":
        let tableFiller;
        if (id === "") {
          // await manyItemTable(await fetchRequest(request, baseURL));
          endpoint = "";
          tableFiller = "MANY";
          console.debug("GET ALL");
        } else {
          endpoint = "/" + id;
          tableFiller = "ONE";
          console.debug("GET ONE");
        }

        console.debug(tableFiller);
        await cacheAndGo(await fetchRequest(request, baseURL + endpoint), endpoint, tableFiller);
        break;
      case "POST":
        endpoint = "";
        await cacheAndGo(await fetchRequest(request, baseURL + endpoint, bodyBuilder(undefined, name, role)), endpoint, "ONE");
        // TODO: elseif for posting many
        break;
      case "DELETE": //CORS ERRORS
        // TODO:
        endpoint = "/" + id;
        await cacheAndGo(await fetchRequest(request, baseURL + endpoint), endpoint, "ONE");
        break;
      case "PUT": //CORS ERRORS
        endpoint = "/" + id;
        await cacheAndGo(await fetchRequest(request, baseURL + endpoint, bodyBuilder(id, name, role)), endpoint, "ONE");
        break;
      default:
        break;
    }
  }
  catch (err) {
    // clearCache();
    throw err;
  }
}

async function tableHandler() {
  const response = JSON.parse(sessionStorage.getItem('response'));
  const tableFiller = sessionStorage.getItem('filler');
  console.debug("TABLE HANDLER: ");
  debugCache();
  switch (tableFiller) {
    case "ONE":
      await oneItemTable(response);
      break;
    case "MANY":
      await manyItemTable(response);
      break;
    default:
      break;
  }
}


// ---------------- Client Table Methods ----------------//

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

async function cacheAndGo(response, endpoint, tableType) {
  console.debug("CACHE AND GO");
  debugCache();
  if (!errorItem(response)) {
    sessionStorage.setItem("filler", tableType);
    window.location.replace(homeURL + endpoint);
  } else {
    alert("Input invalid");
  }
}

async function fetchRequest(request, endpoint) {
  const answer = await fetch(
    (endpoint),
    {
      method: request,
      headers: {
        'Content-Type': 'application/json',
      }
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