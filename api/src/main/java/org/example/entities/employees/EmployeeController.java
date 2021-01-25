package org.example.entities.employees;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
=======
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
>>>>>>> 2767f01da3a175d261193a3ef92d3e4379c02b7a
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

//For personal reference: https://spring.io/guides/tutorials/rest/

@RestController
public class EmployeeController {

  @Autowired
  private EmployeeService employeeService;

  @GetMapping({ "${endpoints.employees.en}", "${endpoints.employees.fr}" })
  public List<EmployeeDTO> findAll() {
    return employeeService.findAll();
  }

  @GetMapping({ "${endpoints.employees.en}/{id}", "${endpoints.employees.fr}/{id}" })
  public EmployeeDTO findEmployeeByID(@PathVariable Long id) {
    return employeeService.findEmployeeByID(id);
  }

  @PostMapping({ "${endpoints.employees.en}", "${endpoints.employees.fr}" })
  public EmployeeDTO addEmployee(@RequestBody EmployeeDTO employee) {
    return employeeService.addEmployee(employee);
  }

  @PostMapping({ "${endpoints.employees.en}/bulk", "${endpoints.employees.fr}/vrac" })
  public List<EmployeeDTO> addEmployees(@RequestBody List<EmployeeDTO> employees) {
    return employeeService.addEmployees(employees);
  }

  @PutMapping({ "${endpoints.employees.en}/{id}", "${endpoints.employees.fr}/{id}" })
  public EmployeeDTO updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employee) {
    return employeeService.updateEmployee(id, employee);
  }

  @DeleteMapping({ "${endpoints.employees.en}/{id}", "${endpoints.employees.fr}/{id}" })
  public void deleteEmployee(@PathVariable Long id) {
    employeeService.deleteEmployee(id);
  }

  @GetMapping(value = {"{name}"})
  public EmployeeDTO findByName(EmployeeDTO anEmployee, @PathVariable String name) {
    return anEmployee;
  }

  @GetMapping(value = {"{id}"})
  public EmployeeDTO findById(EmployeeDTO anEmployee) {
    return anEmployee;
  }

  /*
  @PostMapping("newEmployee")
  public EmployeeDTO findByid(@RequestBody EmployeeDTO anEmployee) {
    return anEmployee;
  }


  */


}
