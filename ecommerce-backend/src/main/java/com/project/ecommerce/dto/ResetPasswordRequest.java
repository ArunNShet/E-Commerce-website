package com.project.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank @Pattern(regexp = "^[0-9]{7,15}$", message = "Phone number must contain 7 to 15 digits") String phone,
        @NotBlank @Size(min = 8, max = 120) String newPassword
) {
}
