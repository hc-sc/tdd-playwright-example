package org.example.UnitTests.Employees;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.stream.Stream;

import org.junit.Before;
import org.example.UnitTests.BaseUnitTest;
import org.example.entities.employees.EmployeeDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import jakarta.validation.Valid;

public class EmployeeUT extends BaseUnitTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    // @Before
    // public void setup() {
    // factory = Validation.buildDefaultValidatorFactory();
    // validator = factory.getValidator();
    // }

    private static Stream<Arguments> isValid_aStream() {
        return Stream.of(Arguments.of(1L, "myName", "MyRole", ""));
    }

    @ParameterizedTest
    @MethodSource("isValid_aStream")
    void isValid_EmployeeDTO(Long id, String name, String role, String comment) {

        EmployeeDTO eDto = new EmployeeDTO();
        eDto.setId(id);
        eDto.setName(null);
        eDto.setRole(role);
        eDto.setComment(comment);

        Set<ConstraintViolation<EmployeeDTO>> violations = validator.validate(eDto);
        assertTrue(violations.isEmpty());
        for (ConstraintViolation<EmployeeDTO> constraintViolation : violations) {
            System.out.println(constraintViolation.getMessage());
        }

    }
}
