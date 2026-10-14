package com.project.ecommerce.dto;

public record AuthResponse(
        String tokenType,
        String accessToken,
        String phone,
        String role
) {
}
