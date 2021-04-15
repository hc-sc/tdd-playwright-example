package org.example.entities.employees;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;

@Data
@Entity
@Table(name = "employees")
// @AllArgsConstructor
public class EmployeeEntity {

  private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;

  // @NonNull // Lombak runtime
  @NotNull(message = "Name cannot be null")
  private String name;

  @NotNull
  private String role;

  private String comment;

}