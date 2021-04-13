package org.example.entities.employees;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.regex.Pattern;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {

  @Min(value = 1L)
  Long id;

  @NotNull
  private String name;

  @NotNull
  private String role;
  private String comment;

}
