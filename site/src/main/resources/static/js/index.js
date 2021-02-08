(async () => {
  const employees = await fetch(
    "https://localhost:8443/findAll/"
  ).then((response) => response.json());


  const table = document.querySelector("#js-employees > tbody");

  employees.forEach((employee) => {
    createTable(employee, ["id", "name", "role"]);
  });
})();


(async () => {
  const employees = await fetch(
    "https://localhost:8443/find/"
  ).then((response) => response.json());

  const table = document.querySelector("#js-employees > tbody");

  createTable(employees, ["id", "name", "role"]);
})();

(async () => {
  const employees = await fetch(
    "https://localhost:8443/add?name={name}&role={role}"
  ).then((response) => response.json());

  console.log(employees);

  const table = document.querySelector("#js-employees > tbody");

    createTable(employees, ["id", "name", "role"]);
})();

(async () => {
  const successful = await fetch(
    "https://localhost:8443/delete/{id}"
  ).then((response) => response.json());


  const table = document.querySelector("#js-successful > tbody");
  createTable(successful, ["successful"]);
})();

function createTable(employees, keys){
    const row = document.createElement("tr");
    const tds = keys.forEach((key) => {
      const td = document.createElement("td");
      td.textContent = employees[key];
      row.appendChild(td);
    });
    table.appendChild(row);
}