package org.example.entities.employees;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.example.http.error.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;

@Service
public class EmployeeService {

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private EmployeeMapper employeeMapper;

  @NonNull
  public Map<String, List<@NonNull EmployeeDTO>> findAll() {
    try {
      List<EmployeeEntity> eEmployees = employeeRepository.findAll();

      Map<String, List<EmployeeDTO>> dEmployees = new HashMap<String, List<EmployeeDTO>>();
      dEmployees.put("employees",
          eEmployees.stream().map(x -> employeeMapper.employeeEntityToEmployeeDTO(x)).collect(Collectors.toList()));
      return dEmployees;

    } catch (NullPointerException e) {
      throw new EntityNotFoundException("Entity not found.");
    }
  }

  @NonNull
  public EmployeeDTO findEmployeeByID(@NonNull Long id) {
    try {
      EmployeeEntity eEntity = employeeRepository.findById(id).orElse(null);

      if (!isValid(eEntity))
        throw new EntityNotFoundException("Entity not found. " + eEntity.toString());

      return employeeMapper.employeeEntityToEmployeeDTO(eEntity);

    } catch (NullPointerException e) {
      throw new EntityNotFoundException("Entity not found.");
    }

  }

  @NonNull
  public EmployeeDTO findEmployeeByID(EmployeeDTO employeeDto) {
    try {
      return findEmployeeByID(employeeDto.getId());
    } catch (NullPointerException e) {
      throw new EntityNotFoundException("Entity not found.");
    }

  }

  @NonNull
  public EmployeeDTO addEmployee(@NonNull EmployeeDTO employeeDto) {
    try {
      EmployeeEntity eEmployee = employeeRepository.save(employeeMapper.employeeDTOToEmployeeEntity(employeeDto));

      if (!isValid(eEmployee))
        throw new IllegalArgumentException("Illegal argument for saving entity to repository.");

      return employeeMapper.employeeEntityToEmployeeDTO(eEmployee);
    } catch (NullPointerException e) {
      throw new IllegalArgumentException("Illegal argument for saving entity to repository.");
    }
  }

  // convert all DTOs to Entities, insert them, then convert the returned
  // entities back to DTOs to send back
  @NonNull
  public List<EmployeeDTO> addEmployees(List<EmployeeDTO> employeeDtos) {
    try {
      if (!employeeDtos.isEmpty())
        throw new IllegalArgumentException("Illegal argument for saving entity to repository.");

      return employeeRepository
          .saveAll(employeeDtos.stream().map(x -> employeeMapper.employeeDTOToEmployeeEntity(x))
              .collect(Collectors.toList()))
          .stream().map(x -> employeeMapper.employeeEntityToEmployeeDTO(x)).collect(Collectors.toList());

    } catch (NullPointerException e) {
      throw new EntityNotFoundException("Entity not found.");
    }
  }

  @NonNull
  public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDto) {

    EmployeeEntity employeeEntity = employeeRepository.findById(id).orElse(null);
    if (!isValid(employeeEntity))
      throw new EntityNotFoundException("Entity not found.");

    return employeeMapper
        .employeeEntityToEmployeeDTO(employeeRepository.save(employeeMapper.employeeDTOToEmployeeEntity(employeeDto)));
    // return employeeMapper.employeeEntityToEmployeeDTO(employeeEntity);
  }

  @NonNull
  public EmployeeDTO deleteEmployee(Long id) {
    EmployeeEntity employeeEntity = employeeRepository.findById(id).orElse(null);

    if (!isValid(employeeEntity))
      throw new EntityNotFoundException("Entity not found.");

    EmployeeDTO employeeDto = employeeMapper.employeeEntityToEmployeeDTO(employeeEntity);
    employeeRepository.deleteById(id);
    employeeDto.setComment("Deleted");
    return employeeDto;

  }

  public boolean isValid(List<EmployeeEntity> employees) {
    return !employees.isEmpty();
  }

  public boolean isValid(EmployeeEntity employee) {

    // if (employee == null)
    // throw new EntityNotFoundException("Entity not found.");

    // Long id = employee.getId();
    // String name = employee.getName();
    // String role = employee.getRole();

    boolean isValid = employee != null && employee.getId() != null && employee.getId() > 0L
        && validText(employee.getName()) && validText(employee.getRole());
    if (!isValid) {
      throw new EntityNotFoundException("Entity not found.");
    }
    return isValid;
  }

  public boolean isValid(EmployeeDTO employee) {
    Long id = employee.getId();
    String name = employee.getName();
    String role = employee.getRole();
    boolean isValid = employee != null && id != null && id > 0L && validText(name) && validText(role);
    if (!isValid) {
      throw new EntityNotFoundException("Entity not found.");
    }
    return isValid;
  }

  private boolean isValid(String regex, String input) {
    input = input.replaceAll("\\s+", ""); // removes all white space in input
    Pattern pattern = Pattern.compile(regex);
    return pattern.matcher(input).matches();
  }

  private boolean validText(String input) {
    String regex = "[A-Za-z\\-]+";
    return (!input.isEmpty() && isValid(regex, input));
  }

}
