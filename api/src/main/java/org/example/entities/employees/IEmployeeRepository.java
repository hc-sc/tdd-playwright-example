
package org.example.entities.employees;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;

@Repository
interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {

    // @Query("SELECT u FROM Employees u WHERE u.name = :name and u.role = :role")
    // List<EmployeeEntity> findByNameOrderByNameAndRole(@Param("name") String name, @Param("role") String role); //ascending order default

}