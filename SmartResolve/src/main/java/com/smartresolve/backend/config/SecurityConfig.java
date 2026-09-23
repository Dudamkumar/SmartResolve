package com.smartresolve.backend.config;

import com.smartresolve.backend.security.JwtAuthenticationFilter;
import com.smartresolve.backend.security.OAuth2SuccessHandler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            OAuth2SuccessHandler oAuth2SuccessHandler) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.IF_REQUIRED
                )
            )

            .exceptionHandling(exception ->
                exception.defaultAuthenticationEntryPointFor(
                    new HttpStatusEntryPoint(
                        HttpStatus.UNAUTHORIZED
                    ),
                    request ->
                        request.getRequestURI()
                               .startsWith("/api/")
                )
            )

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC AUTHENTICATION
                // =========================
                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()

                // =========================
                // GOOGLE OAUTH2
                // =========================
                .requestMatchers(
                    "/oauth2/**",
                    "/login/**"
                ).permitAll()

                // =========================
                // ROLE TEST ENDPOINTS
                // =========================
                .requestMatchers("/api/test/user")
                    .hasRole("USER")

                .requestMatchers("/api/test/support")
                    .hasRole("SUPPORT")

                .requestMatchers("/api/test/supervisor")
                    .hasRole("SUPERVISOR")

                .requestMatchers("/api/test/admin")
                    .hasRole("ADMIN")

                // =========================
                // SUPPORT USERS
                // Only SUPERVISOR can get
                // support staff for assignment
                // =========================
                .requestMatchers("/api/users/support")
                    .hasRole("SUPERVISOR")

                // =========================
                // USER MANAGEMENT
                // ADMIN only
                // =========================
                .requestMatchers("/api/users/**")
                    .hasRole("ADMIN")

                // =========================
                // COMPLAINT ASSIGNMENT
                // SUPERVISOR only
                // =========================
                .requestMatchers("/api/complaints/*/assign")
                    .hasRole("SUPERVISOR")

                // =========================
                // COMPLAINT STATUS
                // SUPPORT + SUPERVISOR + ADMIN
                // =========================
                .requestMatchers("/api/complaints/*/status")
                    .hasAnyRole(
                        "SUPPORT",
                        "SUPERVISOR",
                        "ADMIN"
                    )

                // =========================
                // COMMENTS
                // All logged-in roles
                // =========================
                .requestMatchers(
                    "/api/complaints/*/comments/**"
                )
                .hasAnyRole(
                    "USER",
                    "SUPPORT",
                    "SUPERVISOR",
                    "ADMIN"
                )

                // =========================
                // NOTIFICATIONS
                // =========================
                .requestMatchers("/api/notifications")
                    .authenticated()

                .requestMatchers("/api/notifications/**")
                    .authenticated()

                // =========================
                // DASHBOARD
                // SUPERVISOR + ADMIN
                // =========================
                .requestMatchers("/api/dashboard")
                    .hasAnyRole(
                        "SUPERVISOR",
                        "ADMIN"
                    )

                // =========================
                // ASSIGNED COMPLAINTS
                // SUPPORT + SUPERVISOR + ADMIN
                // =========================
                .requestMatchers("/api/complaints/assigned")
                    .hasAnyRole(
                        "SUPPORT",
                        "SUPERVISOR",
                        "ADMIN"
                    )

                // =========================
                // EVERYTHING ELSE
                // Requires login
                // =========================
                .anyRequest()
                    .authenticated()
            )

            // =========================
            // GOOGLE LOGIN
            // =========================
            .oauth2Login(oauth ->
                oauth.successHandler(
                    oAuth2SuccessHandler
                )
            )

            // =========================
            // JWT FILTER
            // =========================
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    // =============================================================
    // CORS CONFIGURATION
    // =============================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:5173",
                "http://localhost:5174"
            )
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}