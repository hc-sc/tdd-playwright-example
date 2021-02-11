const baseURL = "${serviceURL}" + "${endpoints.employees.en}";

// GetAll
(async () => {
  const employees = await fetch(
    baseURL
  ).then((response) => response.json());

  const table = document.querySelector("#js-employees > tbody");

  employees.forEach((employee) => {
    createTable(employee, ["id", "name", "role"]);
  });
})();

// GetOne
(async () => {
  const employees = await fetch(
    (baseURL + "/{id}")
  ).then((response) => response.json());

  const table = document.querySelector("#js-employees > tbody");

  createTable(employees, ["id", "name", "role"]);
})();

// PostOne
(async () => {
  const employees = await fetch(
    (baseURL + "/add")
  ).then((response) => response.json());

  console.log(employees);

  const table = document.querySelector("#js-employees > tbody");

  createTable(employees, ["id", "name", "role"]);
})();

// PostMany
(async () => {
  const employees = await fetch(
    (baseURL + "/bulk")
  ).then((response) => response.json());


  const table = document.querySelector("#js-employees > tbody");

  employees.forEach((employee) => {
    createTable(employee, ["id", "name", "role"]);
  });
})();

// UpdateOne
(async () => {
  const successful = await fetch(
    (baseURL + "/{id}")
  ).then((response) => response.json());

  const table = document.querySelector("#js-successful > tbody");

  createTable(successful, ["successful"]);
})();

// DeleteOne
(async () => {
  const successful = await fetch(
    (baseURL + "/{id}")
  ).then((response) => response.json());

  const table = document.querySelector("#js-successful > tbody");

  createTable(successful, ["successful"]);
})();


function createTable(employees, keys) {
  const row = document.createElement("tr");
  const tds = keys.forEach((key) => {
    const td = document.createElement("td");
    td.textContent = employees[key];
    row.appendChild(td);
  });
  table.appendChild(row);
}