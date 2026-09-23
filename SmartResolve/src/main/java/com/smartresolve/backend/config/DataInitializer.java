package com.smartresolve.backend.config;

import com.smartresolve.backend.entity.Role;
import com.smartresolve.backend.entity.User;
import com.smartresolve.backend.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@smartresolve.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setName("SmartResolve Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println(
                        "Default ADMIN user created: "
                                + adminEmail
                );
            }
        };
    }
}