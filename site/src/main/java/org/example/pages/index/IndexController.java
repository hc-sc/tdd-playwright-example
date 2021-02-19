package org.example.pages.index;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.example.entities.employees.EmployeeDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class IndexController {
  private static final Logger log = LoggerFactory.getLogger(IndexController.class);

  @Autowired
  private IndexService indexService;

  @GetMapping({ "${endpoints.employees.en}", "${endpoints.employees.fr}" })
  public String findAll(Model model) {

    log.debug(System.getProperties().toString());
    log.debug(System.getenv().toString());

    model.addAttribute("employees", indexService.getEmployees());
    return "index";
  }

  @GetMapping({ "${endpoints.employees.en}/{id}", "${endpoints.employees.fr}/{id}" })
  public String findOne(Model model, @PathVariable String id) {
    model.addAttribute("employees", indexService.getEmployee(id));
    return "index";
  }

  @PostMapping({ "${endpoints.employees.en}/add", "${endpoints.employees.fr}/add" })
  public String addOne(Model model, @RequestParam(name = "name") String name, @RequestParam(name = "role") String role)
      throws JsonProcessingException {
    model.addAttribute("employees", indexService.addEmployee(createEmployeeDto(name, role)));
    return "index";
  }

  // @PostMapping({ "${endpoints.employees.en}/bulk",
  // "${endpoints.employees.fr}/vrac" })
  // public String addMany(Model model, @RequestBody List<EmployeeDTO> employees)
  // throws JsonProcessingException {
  // model.addAttribute("employees", indexService.addEmployees(employees));
  // return "index";
  // }

  // UPDATE
  @PostMapping({ "${endpoints.employees.en}/update", "${endpoints.employees.fr}/update" })
  public String updateEmployee(Model model, @RequestParam(name = "id") String id,
      @RequestParam(name = "name") String name, @RequestParam(name = "role") String role)
      throws JsonProcessingException {
    model.addAttribute("employees", indexService.updateEmployee(createEmployeeDto(id, name, role)));
    return "index";
  }

  // DELETE
  @PostMapping({ "${endpoints.employees.en}/delete", "${endpoints.employees.fr}/delete" })
  public String deleteOne(Model model, @RequestParam(name = "id") String id) throws JsonProcessingException {
    model.addAttribute("successful", indexService.deleteEmployee(id));
    System.out.println(model.getAttribute("successful"));
    return "index";
  }

  private EmployeeDTO createEmployeeDto(String name, String role) {
    EmployeeDTO employee = new EmployeeDTO();
    employee.setName(name);
    employee.setRole(role);
    System.out.println(employee.toString());
    return employee;
  }

  private EmployeeDTO createEmployeeDto(String id, String name, String role) {
    EmployeeDTO employee = new EmployeeDTO();
    employee.setId(Long.valueOf(id));
    employee.setName(name);
    employee.setRole(role);
    System.out.println(employee.toString());
    return employee;
  }

}