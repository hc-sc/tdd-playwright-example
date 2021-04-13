package org.example.UnitTests.EmployeeService;

import org.example.TestUtils.EmployeeTestHelper;
import org.example.UnitTests.BaseUnitTest;
import org.example.entities.employees.EmployeeDTO;
import org.example.entities.employees.EmployeeEntity;
import org.example.entities.employees.EmployeeMapper;
import org.example.entities.employees.EmployeeRepository;
import org.example.entities.employees.EmployeeService;
import org.example.http.error.EntityNotFoundException;
import org.junit.Before;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.mockito.junit.jupiter.MockitoExtension;

import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;

import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
public class ServiceUnitTest extends BaseUnitTest {

    @Mock
    protected EmployeeRepository eRepository;

    @Mock
    protected EmployeeMapper eMapper;

    @Autowired
    @InjectMocks
    protected EmployeeService eService;

    private static Stream<Arguments> isValid_aStream() {
        Long validId = 1L;
        String validName = "myName";
        String validRole = "myRole";

        Long invalidId = 0L;
        String invalidName = "myN4m3";
        String invalidRole = "myR0l3";

        return Stream.of(
                Arguments.of(new EmployeeEntity(validId, validName, validRole, null),
                        new EmployeeDTO(validId, validName, validRole, null), false),
                Arguments.of(new EmployeeEntity(invalidId, validName, validRole, null),
                        new EmployeeDTO(invalidId, validName, validRole, null), true),
                Arguments.of(new EmployeeEntity(validId, invalidName, validRole, null),
                        new EmployeeDTO(validId, invalidName, validRole, null), true),
                Arguments.of(new EmployeeEntity(validId, validName, invalidRole, null),
                        new EmployeeDTO(validId, validName, invalidRole, null), true),
                Arguments.of(null, new EmployeeDTO(validId, validName, invalidRole, null), true));
    }

    @ParameterizedTest
    @MethodSource("isValid_aStream")
    @DisplayName("findAll")
    public void findAll(EmployeeEntity eEntity, EmployeeDTO eDto, boolean expectException) {
        // given

        // when
        when(eRepository.findAll()).thenReturn(Arrays.asList(eEntity));
        when(eMapper.employeeEntityToEmployeeDTO(eEntity)).thenReturn(eDto);
        EmployeeDTO result = eService.findAll().get("employees").get(0);

        // then
        assertEquals(eDto, result);
        verify(eRepository, times(1)).findAll();
        verify(eMapper, times(1)).employeeEntityToEmployeeDTO(eEntity);

        InOrder inOrder = Mockito.inOrder(eRepository, eMapper);
        inOrder.verify(eRepository).findAll();
        inOrder.verify(eMapper).employeeEntityToEmployeeDTO(eEntity);
        inOrder.verifyNoMoreInteractions();

    }

    @ParameterizedTest
    @MethodSource("isValid_aStream")
    @DisplayName("FindEmployeeById")
    public void findEmployeeById(EmployeeEntity eEntity, EmployeeDTO eDto, boolean expectException) {

        // given
        InOrder inOrder = Mockito.inOrder(eRepository, eMapper);
        // when
        when(eRepository.findById(eDto.getId())).thenReturn(Optional.ofNullable(eEntity));

        if (expectException) {
            Exception exception = assertThrows(EntityNotFoundException.class, () -> {
                EmployeeDTO result = eService.findEmployeeByID(eDto.getId());
            });
            assertEquals("Entity not found.", exception.getMessage());

            inOrder.verify(eRepository, times(1)).findById(eDto.getId());
            inOrder.verifyNoMoreInteractions();
        } else {
            when(eMapper.employeeEntityToEmployeeDTO(eEntity)).thenReturn(eDto);
            EmployeeDTO result = eService.findEmployeeByID(eDto.getId());
            // then
            assertEquals(eDto, result);

            inOrder.verify(eRepository, times(1)).findById(eDto.getId());
            inOrder.verify(eMapper, times(1)).employeeEntityToEmployeeDTO(eEntity);
            inOrder.verifyNoMoreInteractions();

        }

    }

    @ParameterizedTest
    @MethodSource("isValid_aStream")
    @DisplayName("FindEmployeeByIdViaDto")
    public void findEmployeeByIdViaDto(EmployeeEntity eEntity, EmployeeDTO eDto, boolean expectException) {
        // given arguments
        InOrder inOrder = Mockito.inOrder(eRepository, eMapper);

        // when
        when(eRepository.findById(eDto.getId())).thenReturn(Optional.ofNullable(eEntity));

        if (expectException) {
            Exception exception = assertThrows(EntityNotFoundException.class, () -> {
                EmployeeDTO result = eService.findEmployeeByID(eDto);
            });
            assertEquals("Entity not found.", exception.getMessage());

            inOrder.verify(eRepository, times(1)).findById(eDto.getId());
            inOrder.verifyNoMoreInteractions();
        } else {
            when(eMapper.employeeEntityToEmployeeDTO(eEntity)).thenReturn(eDto);
            EmployeeDTO result = eService.findEmployeeByID(eDto.getId());
            // then
            assertEquals(eDto, result);

            inOrder.verify(eRepository, times(1)).findById(eDto.getId());
            inOrder.verify(eMapper, times(1)).employeeEntityToEmployeeDTO(eEntity);
            inOrder.verifyNoMoreInteractions();

        }

    }

    @ParameterizedTest
    @MethodSource("isValid_aStream")
    @DisplayName("addOne")
    public void addOne(EmployeeEntity eEntity, EmployeeDTO eDto, boolean expectException) {
        // given arguments
        InOrder inOrder = Mockito.inOrder(eRepository, eMapper);

        // when
        if (expectException) {
            Exception exception = assertThrows(EntityNotFoundException.class, () -> {
                EmployeeDTO result = eService.addEmployee(eDto);
            });
            assertEquals("Entity not found.", exception.getMessage());
        } else {
            when(eMapper.employeeEntityToEmployeeDTO(eEntity)).thenReturn(eDto);
            when(eRepository.save(eEntity)).thenReturn(eEntity);
            when(eMapper.employeeDTOToEmployeeEntity(eDto)).thenReturn(eEntity);
            EmployeeDTO result = eService.addEmployee(eDto);

            // then
            assertEquals(eDto, result);

            verify(eMapper, times(1)).employeeDTOToEmployeeEntity(eDto);
            verify(eRepository, times(1)).save(eEntity);
            verify(eMapper, times(1)).employeeEntityToEmployeeDTO(eEntity);

            inOrder.verify(eMapper).employeeDTOToEmployeeEntity(eDto);
            inOrder.verify(eRepository).save(eEntity);
            inOrder.verify(eMapper).employeeEntityToEmployeeDTO(eEntity);
            inOrder.verifyNoMoreInteractions();
        }

    }

    @ParameterizedTest
    @MethodSource("isValid_aStream")
    @DisplayName("updateOne")
    public void updateOne(EmployeeEntity eEntity, EmployeeDTO eDto, boolean expectException) {
        // given

        if (expectException) {

            when(eRepository.findById(eDto.getId())).thenReturn(Optional.ofNullable(null));

            Exception exception = assertThrows(EntityNotFoundException.class, () -> {
                EmployeeDTO result = eService.updateEmployee(eDto.getId(), eDto);
            });
            assertEquals("Entity not found.", exception.getMessage());

        } else {

            EmployeeEntity eEntityUpdated = EmployeeTestHelper.updateEntity(eEntity);
            EmployeeDTO eDtoUpdated = EmployeeTestHelper.updateDto(eDto);

            // when
            when(eMapper.employeeEntityToEmployeeDTO(eEntity)).thenReturn(eDto);
            when(eRepository.save(eEntity)).thenReturn(eEntity);
            when(eMapper.employeeDTOToEmployeeEntity(eDto)).thenReturn(eEntity);
            when(eRepository.findById(eDto.getId())).thenReturn(Optional.ofNullable(eEntity));
            EmployeeDTO result = eService.updateEmployee(eDto.getId(), eDtoUpdated);

            // then
            assertEquals(eDtoUpdated, result);

            verify(eRepository, times(1)).save(eEntity);
            verify(eRepository, times(1)).findById(eDto.getId());
            verify(eMapper, times(1)).employeeDTOToEmployeeEntity(eDto);
            verify(eMapper, times(1)).employeeEntityToEmployeeDTO(eEntity);

            InOrder inOrder = Mockito.inOrder(eRepository, eMapper);
            inOrder.verify(eRepository).findById(eDto.getId());
            inOrder.verify(eMapper).employeeDTOToEmployeeEntity(eDto);
            inOrder.verify(eRepository).save(eEntity);
            inOrder.verify(eMapper).employeeEntityToEmployeeDTO(eEntity);
            inOrder.verifyNoMoreInteractions();

        }
    }

    @ParameterizedTest
    @MethodSource("isValid_aStream")
    @DisplayName("deleteOne")
    public void deleteOne(EmployeeEntity eEntity, EmployeeDTO eDto, boolean expectException) {
        // given

        if (expectException) {
            // when
            when(eRepository.findById(eDto.getId())).thenReturn(Optional.ofNullable(eEntity));
            Exception exception = assertThrows(EntityNotFoundException.class, () -> {
                EmployeeDTO result = eService.deleteEmployee(eDto.getId());
            });
            assertEquals("Entity not found.", exception.getMessage());

        } else {

            // when
            when(eMapper.employeeEntityToEmployeeDTO(eEntity)).thenReturn(eDto);
            doAnswer((newAnswer) -> {
                return null;
            }).when(eRepository).deleteById(eDto.getId());
            when(eRepository.findById(eDto.getId())).thenReturn(Optional.ofNullable(eEntity));
            EmployeeDTO result = eService.deleteEmployee(eDto.getId());

            eDto.setComment("Deleted");

            // then
            assertEquals(eDto, result);
            verify(eRepository, times(1)).findById(eDto.getId());
            verify(eMapper, times(1)).employeeEntityToEmployeeDTO(eEntity);

            InOrder inOrder = Mockito.inOrder(eRepository, eMapper);
            inOrder.verify(eRepository).findById(eDto.getId());
            inOrder.verify(eMapper).employeeEntityToEmployeeDTO(eEntity);
            inOrder.verify(eRepository, times(1)).deleteById(eDto.getId());
            inOrder.verifyNoMoreInteractions();
        }

    }

}
