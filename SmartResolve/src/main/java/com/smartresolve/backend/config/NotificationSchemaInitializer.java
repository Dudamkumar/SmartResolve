package com.smartresolve.backend.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class NotificationSchemaInitializer {

    private final JdbcTemplate jdbcTemplate;

    public NotificationSchemaInitializer(
            JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void updateNotificationTypeColumn() {

        try {

            jdbcTemplate.execute(
                    "ALTER TABLE notifications " +
                    "MODIFY COLUMN type VARCHAR(50) NOT NULL"
            );

            System.out.println(
                    "Notification type column updated successfully."
            );

        } catch (Exception e) {

            System.out.println(
                    "Notification schema update skipped: "
                    + e.getMessage()
            );
        }
    }
}