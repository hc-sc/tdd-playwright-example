package org.example.pages.index;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.example.entities.employees.EmployeeDTO;

public class Validation {

    // TODO: Bilingual messages

    private static final Logger log = LoggerFactory.getLogger(IndexController.class);

    private static boolean isValid(String regex, String input) {

        input = input.replaceAll("\\s+", ""); // removes all white space in input

        Pattern pattern = Pattern.compile(regex);

        return pattern.matcher(input).matches();
    }

    private static void validId(List<String> errorMessages, String field, String input) {
        // String regex = "[0-9]*";
        // String regex = "^((?!(0))[1-9]*";
        String regex = "\\d*"; // Allows ""
        if (!isValid(regex, input)) {
            errorMessages.add(field + " must only contain numbers between 1 and 9.");
        }
    }

    private static void validText(List<String> errorMessages, String field, String input) {
        String regex = "[A-Za-z\\-]+";

        if (!isValid(regex, input)) {
            errorMessages.add(field + " must only contain letters, dashes, and spaces.");
        }
    }

    private static void validRequest(List<String> errorMessages, String field, String request) {
        if (request.isEmpty() || !(request.equals("GET") || request.equals("POST") || request.equals("PUT")
                || request.equals("DELETE"))) {
            errorMessages.add(field + " must be GET, POST, PUT, or DELETE.");
        }
    }

    public static Map<String, List<String>> isValid(Object data) {
        List<String> errorMessages = new ArrayList<>();

        String type = data.getClass().getSimpleName();
        log.debug("TYPE: " + type);
        switch (type) {
            case "EmployeeDTO":
                EmployeeDTO employee = (EmployeeDTO) data;
                if (employee.getId() == null || employee.getName() == null || employee.getRole() == null) {
                    errorMessages.add("Employee not found.");
                }
                break;
            case "ArrayList":
                List<EmployeeDTO> employees = (ArrayList<EmployeeDTO>) data;
                if (employees.isEmpty()) {
                    errorMessages.add("No employees in database.");
                }
                break;
            default:
                break;
        }

        Map<String, List<String>> errors = new HashMap<>();
        if (!errorMessages.isEmpty()) {
            errors.put("errorMessages", errorMessages);
        }
        return errors;
    }

    public static Map<String, List<String>> isValid(String request, String id, String name, String role) {
        List<String> errorMessages = new ArrayList<>();
        switch (request) {
            case "GET":
                validId(errorMessages, "ID", id);
                break;
            case "POST":
                validText(errorMessages, "Name", name);
                validText(errorMessages, "Role", role);
                break;
            case "PUT":
                validId(errorMessages, "ID", id);
                validText(errorMessages, "Name", name);
                validText(errorMessages, "Role", role);
                break;
            case "DELETE":
                validId(errorMessages, "ID", id);
                break;
            default:
                validRequest(errorMessages, "REQUEST", request);
                break;
        }

        Map<String, List<String>> errors = new HashMap<>();
        if (!errorMessages.isEmpty()) {
            errors.put("errorMessages", errorMessages);
        }
        return errors;
    }

}
