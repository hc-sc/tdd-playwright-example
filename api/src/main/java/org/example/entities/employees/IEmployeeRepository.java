package org.example.entities.employees;

import org.springframework.data.jpa.repository.JpaRepository;

interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {

}