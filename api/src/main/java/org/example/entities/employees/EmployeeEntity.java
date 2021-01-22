package org.example.entities.employees;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "employees")
class EmployeeEntity {

  private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
  private String name;
  private String role;

}