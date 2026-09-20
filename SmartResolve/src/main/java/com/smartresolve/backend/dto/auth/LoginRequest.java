package com.smartresolve.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

	@NotBlank(message = "Email is requested")
	@Email(message="Invalid Email formate")
	private String email;
	
	@NotBlank(message="Password is requested")
	private String password;
	
	public LoginRequest() {
		
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
}
