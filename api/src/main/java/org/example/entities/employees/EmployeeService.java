package org.example.entities.employees;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private EmployeeMapper employeeMapper;

  public Map<String, List<EmployeeDTO>> findAll() {
    Map<String, List<EmployeeDTO>> employees = new HashMap<String, List<EmployeeDTO>>();
    employees.put("employees", employeeRepository.findAll().stream()
        .map(x -> employeeMapper.employeeEntityToEmployeeDTO(x)).collect(Collectors.toList()));
    return employees;
  }

  public EmployeeDTO findEmployeeByID(String id) {
    return employeeMapper.employeeEntityToEmployeeDTO(employeeRepository.findById(Long.valueOf(id)).orElse(null));
  }

  public EmployeeDTO addEmployee(EmployeeDTO employeeDto) {
    return employeeMapper
        .employeeEntityToEmployeeDTO(employeeRepository.save(employeeMapper.employeeDTOToEmployeeEntity(employeeDto)));
  }

  // convert all DTOs to Entities, insert them, then convert the returned
  // entities back to DTOs to send back
  public List<EmployeeDTO> addEmployees(List<EmployeeDTO> employeeDtos) {
    return employeeRepository
        .saveAll(
            employeeDtos.stream().map(x -> employeeMapper.employeeDTOToEmployeeEntity(x)).collect(Collectors.toList()))
        .stream().map(x -> employeeMapper.employeeEntityToEmployeeDTO(x)).collect(Collectors.toList());
  }

  public EmployeeDTO updateEmployee(String id, EmployeeDTO employeeDto) {

    EmployeeEntity employeeEntity = employeeRepository.getOne(Long.valueOf(id));

    if ((employeeDto.getName() != null || !employeeDto.getName().equals(""))
        && !employeeDto.getName().equals(employeeEntity.getName())) {
      employeeEntity.setName(employeeDto.getName());
    }

    if ((employeeDto.getRole() != null || !employeeDto.getRole().equals(""))
        && !employeeDto.getRole().equals(employeeEntity.getRole())) {
      employeeEntity.setRole(employeeDto.getRole());
    }

    return employeeMapper.employeeEntityToEmployeeDTO(employeeRepository.save(employeeEntity));
  }

  public boolean deleteEmployee(String id) {
    Optional<EmployeeEntity> employee = employeeRepository.findById(Long.valueOf(id));
    if (employee.isPresent()) {
      employeeRepository.deleteById(Long.valueOf(id));
      return true;
    }
    return false;
  }

}
