package com.project.ecommerce.dto;

import java.time.LocalDateTime;

public record CustomerResponse(Long id, String name, String phone, String city,
                               String role, int totalOrders, LocalDateTime registeredAt) {
}
