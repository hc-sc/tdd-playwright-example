(async () => {
  const employees = await fetch(
    "https://localhost:8443/findAll/"
  ).then((response) => response.json());

  console.log(employees);

  const table = document.querySelector("#js-employees > tbody");

  employees.forEach((employee) => {
    const row = document.createElement("tr");
    const tds = ["id", "name", "role"].forEach((key) => {
      const td = document.createElement("td");
      td.textContent = employee[key];
      row.appendChild(td);
    });
    table.appendChild(row);
  });
})();


(async () => {
  const employees = await fetch(
    "https://localhost:8443/find/"
  ).then((response) => response.json());

  console.log(employees);

  const table = document.querySelector("#js-employees > tbody");

  (employees => {
    const row = document.createElement("tr");
    const tds = ["id", "name", "role"].forEach((key) => {
      const td = document.createElement("td");
      td.textContent = employees[key];
      row.appendChild(td);
    });
    table.appendChild(row);
  });
})();

(async () => {
  const employees = await fetch(
    "https://localhost:8443/add?name={name}&role={role}"
  ).then((response) => response.json());

  console.log(employees);

  const table = document.querySelector("#js-employees > tbody");

  (employees => {
    const row = document.createElement("tr");
    const tds = ["id", "name", "role"].forEach((key) => {
      const td = document.createElement("td");
      td.textContent = employees[key];
      row.appendChild(td);
    });
    table.appendChild(row);
  });
})();