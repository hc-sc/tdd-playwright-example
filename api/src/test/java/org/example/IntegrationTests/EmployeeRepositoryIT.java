package org.example.IntegrationTests;

import org.example.TestUtils.EmployeeTestHelper;
import org.example.entities.employees.EmployeeEntity;
import org.example.entities.employees.EmployeeRepository;
import org.hibernate.LazyInitializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ActiveProfiles({ "local", "https", "tc" })
public class EmployeeRepositoryIT extends BaseIT {

    @Autowired
    private EmployeeRepository eRepository;

    @Test
    @Sql(scripts = { "/init.sql" })
    public void confirmInitialLoad() {
        assertEntity(EmployeeTestHelper.createEntity("Alex", "Supervisor"), 1);
        assertEntity(EmployeeTestHelper.createEntity("Billy", "Developer"), 2);
        assertEntity(EmployeeTestHelper.createEntity("Yoda", "Jedi"), 3);
        assertThat(eRepository.findAll().size()).isEqualTo(eRepository.count());
        assertThat(eRepository.count()).isEqualTo(3);
        assertNotFound(4);
    }

    @Test
    @Sql(scripts = { "/init.sql" })
    public void addEntity() {
        assertEntity(eRepository.save(EmployeeTestHelper.createEntity("Terry Fox", "Hero")), 4);
        assertThat(eRepository.findAll().size()).isEqualTo(eRepository.count());
    }

    @Test
    @Sql(scripts = { "/init.sql" })
    public void addBulk() {

        long count = eRepository.count();

        List<EmployeeEntity> entities = EmployeeTestHelper.createEntityList();
        count += entities.size();
        eRepository.saveAll(entities);

        assertThat(count).isEqualTo(eRepository.count());
    }

    // @Test
    // @Sql(scripts = { "/init.sql" })
    // public void updateEntity() {
    // EmployeeEntity employee = getOne(1);
    // employee = EmployeeTestHelper.updateEntity(employee);

    // eRepository.save(employee);

    // assertEntity(employee, 1);
    // }

    @Test
    @Sql(scripts = { "/init.sql" })
    public void deleteEntity() {

        long count = eRepository.count();

        eRepository.deleteById(Long.valueOf(1));
        // count--;

        assertThat(eRepository.count()).isEqualTo(--count);
        assertNotFound(1);
    }

    private void assertEntity(EmployeeEntity expected, int idToGet) {
        Optional<EmployeeEntity> received = getOne(idToGet);
        assertThat(expected).usingRecursiveComparison().ignoringFields("id", "comment").isEqualTo(received);
    }

    private Optional<EmployeeEntity> getOne(int idToGet) {
        return eRepository.findById(Long.valueOf(idToGet));
    }

    private void assertNotFound(int idToGet) {
        try {
            getOne(idToGet);
        } catch (LazyInitializationException e) {
            assertThat(e).hasMessage("Unable to find org.example.entities.employees.EmployeeEntity with id " + idToGet);
        }
    }

}
