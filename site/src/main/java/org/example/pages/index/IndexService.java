package org.example.pages.index;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublisher;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.example.entities.employees.EmployeeDTO;
import org.example.util.ApiClient;
import org.example.util.JsonBodyHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class IndexService {
  private static final Logger log = LoggerFactory.getLogger(IndexService.class);

  private String baseURL = "https://localhost:9443/employees";

  public List<EmployeeDTO> getEmployees() {
    log.debug("Getting employees");
    String path = baseURL;
    log.debug(path);

    HttpRequest request = HttpRequest.newBuilder().uri(URI.create(path)).timeout(Duration.ofMinutes(1)).GET().build();

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

    String path = baseURL + "/" + id;
    log.debug(path);

    HttpRequest request = HttpRequest.newBuilder().uri(URI.create(path)).timeout(Duration.ofMinutes(1)).GET().build();

    log.debug(request.toString());

    @SuppressWarnings("unchecked")
    Class<EmployeeDTO> clazz = (Class) EmployeeDTO.class;
    try {
      EmployeeDTO employee = ApiClient.getApiClient().send(request, new JsonBodyHandler<EmployeeDTO>(clazz)).body()
          .get();

      log.debug("" + employee);
      return employee;

    } catch (IOException | InterruptedException e) {
      log.error(e.getMessage());
      return new EmployeeDTO();
    }
  }

  public EmployeeDTO addEmployee(String name, String role) {
    log.debug("Adding employee");

    String path = baseURL;
    log.debug(path + "/add");

    BodyPublisher body = buildFormDataFromMap(createProfile(name, role));
    log.debug(body.toString());

    HttpRequest request = HttpRequest.newBuilder().setHeader("Content-Type", "application/json").POST(body)
        .uri(URI.create(path + "/add")).build();

    log.debug(request.toString());

    @SuppressWarnings("unchecked")
    Class<EmployeeDTO> clazz = (Class) EmployeeDTO.class;
    try {
      EmployeeDTO employeeResponse = ApiClient.getApiClient().send(request, new JsonBodyHandler<EmployeeDTO>(clazz))
          .body().get();

      log.debug("" + employeeResponse);
      return employeeResponse;

    } catch (IOException | InterruptedException e) {
      log.error(e.getMessage());
      return new EmployeeDTO();
    }
  }

  private EmployeeDTO createProfile(String name, String role) {
    EmployeeDTO employee = new EmployeeDTO();
    employee.setName(name);
    employee.setRole(role);
    return employee;
  }

  private BodyPublisher buildFormDataFromMap(EmployeeDTO employee) {
    log.error(employee.toString());
    return HttpRequest.BodyPublishers.ofString("{\"name\": \"JUSTIN\", \"role\": \"TEST\"}");
  }

  // HttpRequest request =
  // HttpRequest.newBuilder().uri(URI.create(baseURL)).timeout(Duration.ofMinutes(1))
  // .POST(BodyPublishers.ofString(createProfile(name, role).toString())).build();
  // log.debug(request.toString());

  // HttpRequest request = HttpRequest.newBuilder()
  // .uri(new URI("https://postman-echo.com/post"))
  // .headers("Content-Type", "text/plain;charset=UTF-8")
  // .POST(HttpRequest.BodyProcessor.fromString()
  // .build();

  // private Map<String, String> createProfile(String name, String role) {
  // Map<String, String> anEmployee = new HashMap<>();
  // anEmployee.put("name", name);
  // anEmployee.put("role", role);
  // return anEmployee;
  // }

  // private BodyPublisher buildFormDataFromMap(Map<String, String> map) {
  // StringBuilder builder = new StringBuilder();
  // builder.append("{");
  // for (Entry<String, String> entry : map.entrySet()) {
  // if (builder.length() > 1) {
  // builder.append(",");
  // }
  // builder.append("\"" + URLEncoder.encode(entry.getKey().toString(),
  // StandardCharsets.UTF_8) + "\"");
  // builder.append(": ");
  // builder.append("\"" + URLEncoder.encode(entry.getValue().toString(),
  // StandardCharsets.UTF_8) + "\"");
  // }
  // builder.append("}");

  // log.error(builder.toString());
  // log.error(map.toString());
  // return HttpRequest.BodyPublishers.ofString(map.toString());
  // }

}
