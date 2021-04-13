DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id serial NOT NULL PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  comment text
);

insert into employees(name,role) values ('Alex','Supervisor');
insert into employees(name,role) values ('Billy','Developer');
insert into employees(name,role) values ('Yoda','Jedi');