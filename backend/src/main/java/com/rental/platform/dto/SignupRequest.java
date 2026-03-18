package com.rental.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits") String phone,
        @Size(min = 6, message = "Password must be at least 6 characters") String password
) {
}

