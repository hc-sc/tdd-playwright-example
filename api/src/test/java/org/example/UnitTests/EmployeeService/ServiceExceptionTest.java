package org.example.UnitTests.EmployeeService;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;

import org.example.TestUtils.EmployeeTestHelper;
import org.example.UnitTests.BaseUnitTest;
import org.example.entities.employees.EmployeeDTO;
import org.example.entities.employees.EmployeeEntity;
import org.example.entities.employees.EmployeeMapper;
import org.example.entities.employees.EmployeeRepository;
import org.example.entities.employees.EmployeeService;
import org.example.http.error.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.provider.Arguments;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

public class ServiceExceptionTest extends ServiceUnitTest {

    @Test
    // @DisplayName("EmployeeService_FindById_Exception_UnitTest")
    public void findEmployeeById_exception() {

        // given
        EmployeeEntity eEntity = EmployeeTestHelper.createEntity(1L);
        EmployeeDTO eDto = EmployeeTestHelper.copyEntityToDto(eEntity);

        // when
        when(eRepository.findById(eEntity.getId())).thenReturn(Optional.ofNullable(null));

        when(eMapper.employeeEntityToEmployeeDTO((null))).thenThrow(new NullPointerException("Error occurred."));

        // then

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            EmployeeDTO result = eService.findEmployeeByID(eDto.getId());
        });
        assertEquals("Entity not found.", exception.getMessage());

        verify(eRepository, times(1)).findById(eEntity.getId());

        InOrder inOrder = Mockito.inOrder(eRepository, eMapper);
        inOrder.verify(eRepository).findById(eDto.getId());
        inOrder.verify(eMapper).employeeEntityToEmployeeDTO(null);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    // @DisplayName("EmployeeService_FindById_DTO_Exception_UnitTest")
    public void findEmployeeById_DTO_exception() {

        // given
        EmployeeEntity eEntity = EmployeeTestHelper.createEntity(1L);
        EmployeeDTO eDto = EmployeeTestHelper.copyEntityToDto(eEntity);

        // when
        when(eRepository.findById(eEntity.getId())).thenReturn(Optional.ofNullable(null));

        when(eMapper.employeeEntityToEmployeeDTO((null))).thenThrow(new NullPointerException("Error occurred."));

        // then

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            EmployeeDTO result = eService.findEmployeeByID(eDto);
        });
        assertEquals("Entity not found.", exception.getMessage());

        verify(eRepository, times(1)).findById(eEntity.getId());

        InOrder inOrder = Mockito.inOrder(eRepository, eMapper);
        inOrder.verify(eRepository).findById(eDto.getId());
        inOrder.verify(eMapper).employeeEntityToEmployeeDTO(null);
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    public void addOne_exception() {
        // given
        EmployeeEntity eEntity = EmployeeTestHelper.createEntity();
        EmployeeDTO eDto = EmployeeTestHelper.copyEntityToDto(eEntity);

        EmployeeEntity eEntitySaved = EmployeeTestHelper.saveEntity(eEntity);
        EmployeeDTO eDtoSaved = EmployeeTestHelper.copyEntityToDto(eEntitySaved);

        // when
        when(eMapper.employeeEntityToEmployeeDTO(eEntitySaved)).thenReturn(eDtoSaved);
        when(eRepository.save(eEntity)).thenReturn(eEntitySaved);
        when(eMapper.employeeDTOToEmployeeEntity(eDto)).thenReturn(eEntity);
        EmployeeDTO result = eService.addEmployee(eDto);

        // then
        assertEquals(eDtoSaved, result);

        verify(eMapper, times(1)).employeeDTOToEmployeeEntity(eDto);
        verify(eRepository, times(1)).save(eEntity);
        verify(eMapper, times(1)).employeeEntityToEmployeeDTO(eEntity);

        InOrder inOrder = Mockito.inOrder(eRepository, eMapper);
        inOrder.verify(eMapper).employeeDTOToEmployeeEntity(eDto);
        inOrder.verify(eRepository).save(eEntity);
        inOrder.verify(eMapper).employeeEntityToEmployeeDTO(eEntity);
        inOrder.verifyNoMoreInteractions();
    }

}
