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
    employees.put("employees", employeeRepository.findAll().stream().map(x -> employeeMapper.employeeEntityToEmployeeDTO(x))
    .collect(Collectors.toList()));
    return employees;
  }

  public EmployeeDTO findEmployeeByID(Long id) {
    return employeeMapper.employeeEntityToEmployeeDTO(employeeRepository.findById(id).orElse(null));
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


  public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDto) {

    EmployeeEntity employeeEntity = employeeRepository.getOne(id);

      employeeEntity.setName(employeeDto.getName());
      employeeEntity.setRole(employeeDto.getRole());
    
    

    // some merge operation between employeeDto and the one in the DB...

    return employeeMapper.employeeEntityToEmployeeDTO(employeeRepository.save(employeeEntity));
  }

  public boolean deleteEmployee(Long id) {
    Optional<EmployeeEntity> employee = employeeRepository.findById(id);
    if (employee.isPresent()) {
      employeeRepository.deleteById(id);
      return true;
    }
    return false;
  }

}
