package org.example.entities.employees;

import java.util.Optional;

import org.mapstruct.Mapper;

@Mapper
public interface EmployeeMapper {
  EmployeeDTO employeeEntityToEmployeeDTO(EmployeeEntity employeeEntity);

  EmployeeEntity employeeDTOToEmployeeEntity(EmployeeDTO employeeDto);
}
