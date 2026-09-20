package com.smartresolve.backend.entity;
import jakarta.persistence.*;
import java.util.*;
@Entity
@Table(name="departments")
public class Department {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable=false ,unique=true)
	private String name;
	private  String description;
	//Relateion Department ! and Users M
	@OneToMany(mappedBy ="department")
	private List<User>user;
	public Department() {
		
	}
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
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
	this.description=description;
	}
	}

