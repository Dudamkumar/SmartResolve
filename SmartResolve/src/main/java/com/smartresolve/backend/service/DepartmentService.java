package com.smartresolve.backend.service;

import com.smartresolve.backend.entity.Department;
import com.smartresolve.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentService {

	private final DepartmentRepository departmentRepository;
	public DepartmentService(DepartmentRepository departmentRepository) {
		this.departmentRepository=departmentRepository;
	}
	
	public Department createDepartment(Department department) {
		if(departmentRepository.existsByName(department.getName())) {
			throw new IllegalArgumentException(
				"Department already exists"
					);
		}
		return departmentRepository.save(department);
	}
	public List<Department> getAllDepartment(){
		return departmentRepository.findAll();
	}
}
