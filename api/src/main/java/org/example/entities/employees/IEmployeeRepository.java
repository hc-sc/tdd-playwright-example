
package org.example.entities.employees;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {
    List<EmployeeEntity> findAll();
    Optional<EmployeeEntity> findByName(String name);
    Optional<EmployeeEntity> findById(Long id);
}