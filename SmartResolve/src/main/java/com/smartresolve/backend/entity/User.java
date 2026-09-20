package com.smartresolve.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;;
@Entity 
@Table(name="users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	@Column(nullable=false,unique=true)
	private String email;
	@Column(nullable=false)
	private String password;
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private Role role;
	//Relationship between department and user
	@ManyToOne
	@JoinColumn(name="department_id")
	private Department department;
	private  LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	public User() {
		
	}
	//Getters and setters
	public Long getId() {
	return id;
	}
	public void setId(Long id) {
		this.id=id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name=name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email=email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password=password;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role=role;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt=createdAt;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt=updatedAt;
	}
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department=department;
	}
}
