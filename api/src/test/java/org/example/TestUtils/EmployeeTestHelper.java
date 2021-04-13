package org.example.TestUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.example.entities.employees.EmployeeDTO;
import org.example.entities.employees.EmployeeEntity;

public class EmployeeTestHelper {

    public static EmployeeDTO createDto() {
        return createDto("TestName", "TestRole");
    }

    public static EmployeeEntity createEntity() {
        return createEntity("TestName", "TestRole");
    }

    public static EmployeeDTO createDto(String aName, String aRole) {
        EmployeeDTO employee = new EmployeeDTO();
        employee.setName(aName);
        employee.setRole(aRole);
        return employee;
    }

    public static EmployeeEntity createEntity(String aName, String aRole) {
        EmployeeEntity employee = new EmployeeEntity(null, aName, aRole, null);
        employee.setName(aName);
        employee.setRole(aRole);
        return employee;
    }

    public static EmployeeDTO createDto(long id) {
        EmployeeDTO employee = createDto();
        employee.setId(Long.valueOf(id));
        return employee;
    }

    public static EmployeeEntity createEntity(long id) {
        EmployeeEntity employee = createEntity();
        employee.setId(Long.valueOf(id));
        return employee;
    }

    public static EmployeeEntity saveEntity(EmployeeEntity employee) {
        Long id = employee.getId() == null ? 1L : employee.getId();
        employee.setId(id);
        return employee;
    }

    public static EmployeeDTO updateDto(EmployeeDTO eDto) {
        eDto.setName(eDto.getName() + "Updated");
        eDto.setRole(eDto.getRole() + "Updated");
        return eDto;
    }

    public static EmployeeEntity updateEntity(EmployeeEntity eEntity) {
        eEntity.setName(eEntity.getName() + "Updated");
        eEntity.setRole(eEntity.getRole() + "Updated");
        return eEntity;
    }

    public static List<EmployeeDTO> createDtoList() {
        String[] names = { "Fatima", "Halima", "Yasmine" };
        String[] roles = { "CEO", "Director", "Mother" };

        List<EmployeeDTO> employees = new ArrayList<EmployeeDTO>();
        for (int i = 0; i < names.length; i++) {
            EmployeeDTO newEmployee = createDto(names[i], roles[i]);
            employees.add(newEmployee);
        }
        return employees;
    }

    public static List<EmployeeEntity> createEntityList() {
        String[] names = { "Fatima", "Halima", "Yasmine" };
        String[] roles = { "CEO", "Director", "Mother" };

        List<EmployeeEntity> entities = new ArrayList<EmployeeEntity>();
        for (int i = 0; i < names.length; i++) {
            EmployeeEntity newEmployee = createEntity(names[i], roles[i]);
            entities.add(newEmployee);
        }
        return entities;
    }

    public static Map<String, List<EmployeeDTO>> mapDtoList() {
        Map<String, List<EmployeeDTO>> mapDtoList = new HashMap();
        mapDtoList.put("employees", createDtoList());
        return mapDtoList;
    }

    public static EmployeeEntity copyDtoToEntity(EmployeeDTO employee) {
        EmployeeEntity copied = new EmployeeEntity(null, employee.getName(), employee.getRole(), null);
        copied.setId(employee.getId());
        copied.setName(employee.getName());
        copied.setRole(employee.getRole());
        copied.setComment(employee.getComment());
        return copied;
    }

    public static EmployeeDTO copyEntityToDto(EmployeeEntity employee) {
        EmployeeDTO copied = new EmployeeDTO();
        copied.setId(employee.getId());
        copied.setName(employee.getName());
        copied.setRole(employee.getRole());
        copied.setComment(employee.getComment());
        return copied;
    }
}
