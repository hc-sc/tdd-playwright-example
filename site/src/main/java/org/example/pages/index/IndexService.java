package org.example.pages.index;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import static java.net.http.HttpRequest.BodyPublisher;
import static java.net.http.HttpRequest.BodyPublishers;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.example.entities.employees.EmployeeDTO;
import org.example.util.ApiClient;
import org.example.util.JsonBodyHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

@Service
public class IndexService {
  private static final Logger log = LoggerFactory.getLogger(IndexService.class);

  private String baseURL;

  @Autowired
  public void setValues(@Value("${api.url}") String rootUrl,
      @Value("${endpoints.employees.en}") String employeesEndPoint) {
    this.baseURL = rootUrl + "/" + employeesEndPoint;
  }

  public List<EmployeeDTO> getEmployees() {
    log.debug("Getting employees");

    log.debug(baseURL);
    HttpRequest request = HttpRequest.newBuilder().setHeader("Content-Type", "application/json")
        .uri(URI.create(baseURL)).timeout(Duration.ofMinutes(1)).GET().build();
    log.debug(baseURL);

    log.debug(request.toString());

    @SuppressWarnings("unchecked")
    Class<Map<String, List<EmployeeDTO>>> clazz = (Class) Map.class;
    try {
      Map<String, List<EmployeeDTO>> employees = ApiClient.getApiClient()
          .send(request, new JsonBodyHandler<Map<String, List<EmployeeDTO>>>(clazz)).body().get();

      log.debug("" + employees.get("employees").size());
      log.debug("" + employees.get("employees"));
      return employees.get("employees");

    } catch (IOException | InterruptedException e) {
      log.error(e.getMessage());
      return new ArrayList<EmployeeDTO>();
    }
  }

  public EmployeeDTO getEmployee(String id) {
    log.debug("Getting employee");
    HttpRequest request = HttpRequest.newBuilder().setHeader("Content-Type", "application/json")
        .uri(URI.create(baseURL + "/" + id)).timeout(Duration.ofMinutes(1)).GET().build();
    return dtoRequest(request);
  }

  public EmployeeDTO addEmployee(EmployeeDTO employee) throws JsonProcessingException {
    log.debug("Adding employee");

    HttpRequest request = HttpRequest.newBuilder().setHeader("Content-Type", "application/json")
        .POST(BodyPublishers.ofString(employeeMapify(employee))).uri(URI.create(baseURL)).build();

    log.debug(request.toString());
    return dtoRequest(request);
  }

  public List<EmployeeDTO> addEmployees(List<EmployeeDTO> employee) throws JsonProcessingException {
    log.debug("Adding employee");

    HttpRequest request = HttpRequest.newBuilder().setHeader("Content-Type", "application/json")
        .POST(BodyPublishers.ofString(employeeMapify(employee))).uri(URI.create(baseURL + "/bulk"))
        .timeout(Duration.ofMinutes(1)).build();

    log.debug(request.toString());
    return listRequest(request);
  }

  public EmployeeDTO updateEmployee(EmployeeDTO employee) throws JsonProcessingException {
    log.debug("Updating employee");

    HttpRequest request = HttpRequest.newBuilder().setHeader("Content-Type", "application/json")
        .PUT(BodyPublishers.ofString(employeeMapify(employee))).uri(URI.create(baseURL + "/" + employee.getId()))
        .build();

    log.debug(request.toString());
    return dtoRequest(request);
  }

  public String deleteEmployee(String id) throws JsonProcessingException {
    log.debug("Deleting employee");

    HttpRequest request = HttpRequest.newBuilder().setHeader("Content-Type", "application/json")
        .uri(URI.create(baseURL + "/" + id)).timeout(Duration.ofMinutes(1)).DELETE().build();

    return booleanRequest(request);
    // return true;
  }

  /*--------------------HelperMethods--------------*/

  private EmployeeDTO dtoRequest(HttpRequest request) {
    @SuppressWarnings("unchecked")
    Class<EmployeeDTO> clazz = (Class) EmployeeDTO.class;
    try {

      JsonBodyHandler jsonBodyHandler = new JsonBodyHandler<EmployeeDTO>((Class) EmployeeDTO.class);

      EmployeeDTO employeeResponse = ApiClient.getApiClient().send(request, new JsonBodyHandler<EmployeeDTO>(clazz))
          .body().get();

      log.debug("" + employeeResponse);
      return employeeResponse;

    } catch (IOException | InterruptedException e) {
      log.error(e.getMessage());
      return new EmployeeDTO();
    }
  }

  private List<EmployeeDTO> listRequest(HttpRequest request) {
    @SuppressWarnings("unchecked")
    Class<List> clazz = (Class) List.class;
    try {
      List<EmployeeDTO> employeeResponse = ApiClient.getApiClient().send(request, new JsonBodyHandler<List>(clazz))
          .body().get();

      log.debug("" + employeeResponse);
      return employeeResponse;

    } catch (IOException | InterruptedException e) {
      log.error(e.getMessage());
      return new ArrayList<EmployeeDTO>();
    }
  }

  private String booleanRequest(HttpRequest request) {
    @SuppressWarnings("unchecked")
    Class<String> clazz = (Class) String.class;
    try {
      String response = ApiClient.getApiClient().send(request, new JsonBodyHandler<String>(clazz)).body().get();

      log.debug("{\"successful\": \"" + response.toString() + "\"}");
      return ("{\"successful\": \"" + response.toString() + "\"}");

    } catch (IOException | InterruptedException e) {
      log.error(e.getMessage());
      return "Employee with that id not found";
    }
  }

  private EmployeeDTO buildEmployeeDTO(String name, String role) {
    EmployeeDTO employee = new EmployeeDTO();
    employee.setName(name);
    employee.setRole(role);
    return employee;
  }

  private String employeeMapify(EmployeeDTO employee) {
    StringBuilder sb = new StringBuilder();
    sb.append("{");
    try {
      sb.append("\"id\": \"" + employee.getId() + "\",");
    } catch (NullPointerException ex) {
      log.debug(ex.getLocalizedMessage());
    } finally {
      sb.append("\"name\": \"" + employee.getName() + "\",");
      sb.append("\"role\": \"" + employee.getRole() + "\"");
      sb.append("}");
      log.debug(sb.toString());
      return sb.toString();
    }
  }

  private String employeeMapify(List<EmployeeDTO> employees) {
    log.error(employees.toString());

    StringBuilder sb = new StringBuilder();
    sb.append("[");
    for (EmployeeDTO employee : employees) {
      sb.append(employeeMapify(employee));
      if (employee != employees.get(employees.size() - 1))
        sb.append(",");
    }
    sb.append("]");
    return sb.toString();
  }

}
