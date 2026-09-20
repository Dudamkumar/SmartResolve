package com.smartresolve.backend.controller;

import com.smartresolve.backend.dto.dashboard.DashboardResponse;
import com.smartresolve.backend.service.DashboardService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}