package com.project.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
        @NotBlank @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain 10 digits") String phone,
        @NotBlank String password
) {
}
