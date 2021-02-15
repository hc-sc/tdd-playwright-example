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

  @PostMapping({ "${endpoints.employees.en}", "${endpoints.employees.fr}" })
  public String addOne(Model model, @RequestBody EmployeeDTO employee) throws JsonProcessingException {
    model.addAttribute("employees", indexService.addEmployee(employee));
    return "index";
  }

  @PostMapping({ "${endpoints.employees.en}/bulk", "${endpoints.employees.fr}/vrac" })
  public String addMany(Model model, @RequestBody List<EmployeeDTO> employees) throws JsonProcessingException {
    model.addAttribute("employees", indexService.addEmployees(employees));
    return "index";
  }

  @PutMapping({ "${endpoints.employees.en}/{id}", "${endpoints.employees.fr}/{id}" })
  public String updateEmployee(Model model, @RequestBody EmployeeDTO employee) throws JsonProcessingException {
    model.addAttribute("employees", indexService.updateEmployee(employee));
    return "index";
  }

  @DeleteMapping({ "${endpoints.employees.en}/{id}", "${endpoints.employees.fr}/{id}" })
  public String deleteEmployee(Model model, @PathVariable Long id) throws JsonProcessingException {
    model.addAttribute("successful", indexService.deleteEmployee(id));
    return "index";
  }

}