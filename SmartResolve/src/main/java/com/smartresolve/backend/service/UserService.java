package com.smartresolve.backend.service;

import com.smartresolve.backend.dto.auth.LoginRequest;
import com.smartresolve.backend.dto.auth.LoginResponse;
import com.smartresolve.backend.dto.auth.RegisterRequest;
import com.smartresolve.backend.dto.auth.UserResponse;
import com.smartresolve.backend.dto.user.UserUpdateRequest;

import com.smartresolve.backend.entity.Department;
import com.smartresolve.backend.entity.Role;
import com.smartresolve.backend.entity.User;

import com.smartresolve.backend.repository.DepartmentRepository;
import com.smartresolve.backend.repository.UserRepository;

import com.smartresolve.backend.security.JwtService;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            DepartmentRepository departmentRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
        this.jwtService = jwtService;
    }

    // =========================================================
    // REGISTER NORMAL USER
    // =========================================================

    public UserResponse registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Public registration always creates USER
        user.setRole(Role.USER);

        User savedUser =
                userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResponse loginUser(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }

    // =========================================================
    // UPDATE USER ROLE
    // =========================================================

    public UserResponse updateUserRole(
            Long userId,
            UserUpdateRequest request,
            String actingEmail) {

        // Target user
        User targetUser = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // Logged-in admin
        User actingUser = userRepository
                .findByEmail(actingEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        )
                );

        // ---------------------------------------------------------
        // PROTECTION 1
        // Admin cannot change their own role
        // ---------------------------------------------------------

        if (targetUser.getId().equals(actingUser.getId())) {
            throw new IllegalArgumentException(
                    "You cannot change your own role"
            );
        }

        // ---------------------------------------------------------
        // PROTECTION 2
        // Do not remove the last ADMIN
        // ---------------------------------------------------------

        if (targetUser.getRole() == Role.ADMIN
                && request.getRole() != Role.ADMIN
                && userRepository.countByRole(Role.ADMIN) <= 1) {

            throw new IllegalArgumentException(
                    "At least one ADMIN account must remain"
            );
        }

        targetUser.setRole(request.getRole());

        // ---------------------------------------------------------
        // Department update
        // ---------------------------------------------------------

        if (request.getDepartmentId() != null) {

            Department department =
                    departmentRepository.findById(
                            request.getDepartmentId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Department not found"
                            )
                    );

            targetUser.setDepartment(department);
        }

        User updatedUser =
                userRepository.save(targetUser);

        return new UserResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole()
        );
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<UserResponse> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(user ->
                        new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole()
                        )
                )
                .toList();
    }

    // =========================================================
    // CURRENT USER
    // =========================================================

    public UserResponse getCurrentUser(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    // =========================================================
    // REGISTER SUPERVISOR
    // =========================================================

    public UserResponse registerSupervisor(
            RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(Role.SUPERVISOR);

        User savedUser =
                userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    // =========================================================
    // GET SUPPORT USERS
    // =========================================================

    public List<UserResponse> getSupportUsers() {

        return userRepository
                .findByRole(Role.SUPPORT)
                .stream()
                .map(user ->
                        new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole()
                        )
                )
                .toList();
    }
}