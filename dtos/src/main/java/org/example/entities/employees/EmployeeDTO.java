package org.example.entities.employees;

import lombok.Data;
import lombok.Getter;

@Data
public class EmployeeDTO {
  Long id;
  private String name;
  private String role;


}
