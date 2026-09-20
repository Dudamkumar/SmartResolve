package com.smartresolve.backend.controller;

import com.smartresolve.backend.entity.Department;
import com.smartresolve.backend.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

	private final DepartmentService departmentService;
	public DepartmentController(DepartmentService departmentService) {
		this.departmentService=departmentService;
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Department createDepartment(@RequestBody Department department) {
		return departmentService.createDepartment(department);
	}
	
	@GetMapping
	public List<Department>getAllDepartments(){
		return departmentService.getAllDepartment();
	}
}
