package com.smartresolve.backend.repository;
import com.smartresolve.backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface DepartmentRepository extends JpaRepository<Department,Long> {
	
	Optional<Department>findByName(String name);
	 boolean existsByName(String name);
}
