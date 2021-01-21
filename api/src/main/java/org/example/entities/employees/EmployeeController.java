package org.example.entities.employees;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

//For personal reference: https://spring.io/guides/tutorials/rest/

@RestController
public class EmployeeController {

  @Autowired
  private final EmployeeRepository employeeRepository;

  @GetMapping(value = {"${employees.en}", "${employees.fr}"})
  public List<EmployeeDTO> findAll() {
    return Arrays.asList(new EmployeeDTO());
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
