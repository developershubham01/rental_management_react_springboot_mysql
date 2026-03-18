package com.rental.platform.dto;

public record AdminDashboardResponse(
        long totalUsers,
        long totalProperties,
        long pendingProperties,
        long totalPayments
) {
}

