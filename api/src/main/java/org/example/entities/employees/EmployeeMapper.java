package org.example.entities.employees;

import org.mapstruct.Mapper;

@Mapper
public interface EmployeeMapper {
  EmployeeDTO employeeEntityToEmployeeDTO(EmployeeEntity employeeEntity);

  EmployeeEntity employeeDTOToEmployeeEntity(EmployeeDTO employeeDto);
}
