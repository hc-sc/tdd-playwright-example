package org.example.entities.employees;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
class EmployeeEntity {

  private @Id @GeneratedValue Long id;
  private String name;
  private String role;

}