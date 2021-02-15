// const baseURL = "${apiURL}" + "/" + "${endpoints.employees.en}";
const baseURL = "https://localhost:9443/employees";

function getData() {
  var request = document.getElementById('request').value;
  var id = document.getElementById('id').value;
  var name = document.getElementById('name').value;
  var role = document.getElementById('role').value;
  await requestHandler(request, id, name, role);
}

async function requestHandler(request, id, name, role) {
  switch (request) {
    case "GET":
      if (id !== null) {
        await getOne(id);
      } else {
        await getAll();
      }
      break;
    case "POST":
      // code block
      break;
    case "DELETE":
      // code block
      break;
    case "PUT":
      // code block
      break;
  }
}

// GetOne
(async function getOne(id) {
  const employees = await fetch(
    (baseURL + "/" + id)
  ).then((response) => response.json());

  const table = document.querySelector("#js-employees > tbody");

  createTable(table, employees, ["id", "name", "role"]);
})();

// // GetAll
(async function getAll() {
  const employees = await fetch(
    baseURL
  ).then((response) => response.json());

  const table = document.querySelector("#js-employees > tbody");

  employees.forEach((employee) => {
    createTable(table, employee, ["id", "name", "role"]);
  });
})();

function createTable(table, employees, keys) {
  const row = document.createElement("tr");
  const tds = keys.forEach((key) => {
    const td = document.createElement("td");
    td.textContent = employees[key];
    row.appendChild(td);
  });
  return table.appendChild(row);
}

// // GetOne
// (async () => {
//   const employees = await fetch(
//     (baseURL + "/{id}")
//   ).then((response) => response.json());

//   const table = document.querySelector("#js-employees > tbody");

//   createTable(employees, ["id", "name", "role"]);
// })();

// // PostOne
// (async () => {
//   const employees = await fetch(
//     (baseURL)
//   ).then((response) => response.json());

//   console.log(employees);

//   const table = document.querySelector("#js-employees > tbody");

//   createTable(employees, ["id", "name", "role"]);
// })();

// // PostMany
// (async () => {
//   const employees = await fetch(
//     (baseURL + "/bulk")
//   ).then((response) => response.json());


//   const table = document.querySelector("#js-employees > tbody");

//   employees.forEach((employee) => {
//     createTable(employee, ["id", "name", "role"]);
//   });
// })();

// // UpdateOne
// (async () => {
//   const successful = await fetch(
//     (baseURL + "/{id}")
//   ).then((response) => response.json());

//   const table = document.querySelector("#js-successful > tbody");

//   createTable(successful, ["successful"]);
// })();

// // DeleteOne
// (async () => {
//   const successful = await fetch(
//     (baseURL + "/{id}")
//   ).then((response) => response.json());

//   const table = document.querySelector("#js-successful > tbody");

//   createTable(successful, ["successful"]);
// })();



