package org.example.entities.employees;

import lombok.Data;

@Data
public class EmployeeDTO {
  Long id;
  private String name;
  private String role;
  private String comment;

}
