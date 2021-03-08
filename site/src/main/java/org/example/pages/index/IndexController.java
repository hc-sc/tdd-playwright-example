package org.example.pages.index;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.example.entities.employees.EmployeeDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.RequestContextUtils;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class IndexController {
  private static final Logger log = LoggerFactory.getLogger(IndexController.class);

  @Autowired
  private IndexService indexService;

  @GetMapping({ "${endpoints.employees.en}", "${endpoints.employees.fr}" })
  public String viewIndex(HttpServletRequest request, HttpServletResponse response, Model model) {
    try {

      HttpServletResponse resp = (HttpServletResponse) response;
      resp.setHeader("Set-Cookie", "locale=de; HttpOnly; SameSite=strict");

      Map<String, ?> inputFlashMap = RequestContextUtils.getInputFlashMap(request);

      log.debug("FlashMap: " + inputFlashMap.toString());
      model.addAttribute("employees", inputFlashMap.get("employees"));

      return "index";
    } catch (NullPointerException ex) {
      log.error(ex.getMessage());
      return "redirect:/";
    }
  }


  @GetMapping({"/details" })
  public String viewDetails(HttpServletRequest request, Model model) {
    try {
      Map<String, ?> inputFlashMap = RequestContextUtils.getInputFlashMap(request);

      log.debug("FlashMap: " + inputFlashMap.toString());
      model.addAttribute("employees", inputFlashMap.get("employees"));

      return "details";
    } catch (NullPointerException ex) {
      log.error(ex.getMessage());
      return "redirect:/";
    }
  }


  @GetMapping({ "/" })
  public String viewRoot(Model model) {
    return "index";
  }

  @RequestMapping({ "/errors" })
  public String viewError(HttpServletRequest request, Model model) {

    try {
      Map<String, ?> inputFlashMap = RequestContextUtils.getInputFlashMap(request);
      log.debug("FLASH: " + inputFlashMap);
      model.addAttribute("errors", (List<String>) inputFlashMap.get("errors"));
    } catch (NullPointerException ex) {
      log.error(ex.getMessage());
      return "redirect:/";
    }

    return "index";
  }

  @PostMapping({ "/submit" })
  public String handler(final RedirectAttributes redirectAttributes, @RequestParam(name = "request") String request,
      @RequestParam(name = "id") String id, @RequestParam(name = "name") String name,
      @RequestParam(name = "role") String role) throws IOException {

    log.debug("ID: " + (id == "") + " NAME: " + name + " ROLE: " + role);

    // Cleaning Inputs
    id = scrubInput(id);
    name = scrubInput(name);
    role = scrubInput(role);

    if (!validInput(redirectAttributes, request, id, name, role)) {
      return "redirect:/errors";
    }
String direction = "/employees";
    switch (request) {
      case "GET":
        String redirection;
        if (id.isEmpty()) {
          redirection = validResponse(redirectAttributes, indexService.getEmployees(), direction);
        } else {
          redirection = validResponse(redirectAttributes, indexService.getEmployee(id), direction);
        }
        return redirection;
      case "POST":
        return validResponse(redirectAttributes, indexService.addEmployee(createEmployeeDto(name, role)), direction);
      case "PUT":
        return validResponse(redirectAttributes, indexService.updateEmployee(createEmployeeDto(id, name, role)), direction);
      case "DELETE": // TODO
        return validResponse(redirectAttributes, indexService.deleteEmployee(id), direction);
      default:
        return "redirect:/";
    }
  }


  @GetMapping({ "/inspect" })
  public String inspection(final RedirectAttributes redirectAttributes,
      @RequestParam(name = "id") String id, @RequestParam(name = "name") String name,
      @RequestParam(name = "role") String role, @RequestParam(name = "comment") String comment) throws IOException {

        return validResponseQuery(redirectAttributes, createEmployeeDto(id, name, role, comment), "/details");

      }

  // NOT-idempotent
  @GetMapping({ "/employees/{id}" })
  public String inspection(Model model, final RedirectAttributes redirectAttributes, @PathVariable("id") String id) throws IOException {
    EmployeeDTO employee = indexService.getEmployee(id);

    if(!errorMessages(redirectAttributes, Validation.isValid(employee))){
      model.addAttribute("employees", employee);
      return "details";
    }
    return "redirect:/errors";
  }

  private EmployeeDTO createEmployeeDto(String name, String role) {
    EmployeeDTO employee = new EmployeeDTO();
    employee.setName(name);
    employee.setRole(role);
    System.out.println(employee.toString());
    return employee;
  }

  /**
   * 
   * @param id
   * @param name
   * @param role
   * @return
   */
  private EmployeeDTO createEmployeeDto(String id, String name, String role) {
    EmployeeDTO employee = createEmployeeDto(name, role);
    employee.setId(Long.valueOf(id));
    System.out.println(employee.toString());
    return employee;
  }

    /**
   * 
   * @param id
   * @param name
   * @param role
   * @return
   */
  private EmployeeDTO createEmployeeDto(String id, String name, String role, String comment) {
    EmployeeDTO employee = createEmployeeDto(id, name, role);
    employee.setComment(comment);
    return employee;
  }


  private boolean validInput(RedirectAttributes redirectAttributes, String request, String id, String name,
      String role) {
    return !errorMessages(redirectAttributes, Validation.isValid(request, id, name, role));
  }

  private String validResponse(RedirectAttributes redirectAttributes, Object data, String redirection) {
    log.debug("DATA: " + data.toString());
    if (!errorMessages(redirectAttributes, Validation.isValid(data))) {
      redirectAttributes.addFlashAttribute("employees", data);
      return "redirect:" + redirection;
    }
    return "redirect:/errors";
  }

  private String validResponseQuery(RedirectAttributes redirectAttributes, Object data, String redirection) {
    log.debug("DATA: " + data.toString());
    if (!errorMessages(redirectAttributes, Validation.isValid(data))) {
      
      if(redirection.charAt(0) == ('/')){
        redirectAttributes.addFlashAttribute("employees", data);
        return "redirect:" + redirection;
      } else {
        redirectAttributes.addFlashAttribute("employeesQuery", data);
        return redirection;
      }

    }
    return "redirect:/errors";
  }

  private boolean errorMessages(RedirectAttributes redirectAttributes, Map<String, List<String>> errors) {
    boolean errorsOccured = errors.containsKey("errorMessages");
    if (errorsOccured) {
      log.debug("ERRORS REDIRECTION: ");
      redirectAttributes.addFlashAttribute("errors", errors.get("errorMessages")); // temporary validation handling
    }
    return errorsOccured;
  }

  private String scrubInput(String input) {

    // Initial whitespace
    input = input.trim();

    // Leading 0's
    input = input.replaceFirst("^0*", "");

    // Due to empty URL param
    if (input == null || input == "" || input.equals("")) {
      return input;
    }

    // Capitalize Every First-Letter
    String cleaned = "";
    String[] words = input.split("\\s");

    String lastWord = words[words.length - 1];
    for (String word : words) {
      char firstLetter = Character.toUpperCase(word.charAt(0));
      cleaned += firstLetter + word.substring(1).toLowerCase();
      if (word != lastWord) {
        cleaned += " ";
      }
    }

    // Whitespace
    cleaned = cleaned.trim();

    return cleaned;
  }

}