package com.project.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain 10 digits") @Size(max = 10) String phone,
        @NotBlank @Size(max = 120) String city,
        @NotBlank @Size(min = 8, max = 120) String password
) {
}
