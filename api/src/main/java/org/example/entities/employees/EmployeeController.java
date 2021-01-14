package org.example.entities.employees;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmployeeController {

  @GetMapping(value = {"${employees.en}", "${employees.fr}"})
  public List<EmployeeDTO> employees() {
    return Arrays.asList(new EmployeeDTO());
  }
}
