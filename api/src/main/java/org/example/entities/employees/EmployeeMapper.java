package org.example.entities.employees;

import java.util.Optional;

import org.mapstruct.Mapper;

import lombok.NonNull;

@Mapper
public interface EmployeeMapper {

  @NonNull
  EmployeeDTO employeeEntityToEmployeeDTO(@NonNull EmployeeEntity employeeEntity);

  @NonNull
  EmployeeEntity employeeDTOToEmployeeEntity(@NonNull EmployeeDTO employeeDto);

  // @NonNull
  // EmployeeDTO employeeEntityToEmployeeDTO(@NonNull Optional<EmployeeEntity> employeeEntity);

  // @NonNull
  // EmployeeEntity employeeDTOToEmployeeEntity(@NonNull Optional<EmployeeDTO> employeeDto);

}
