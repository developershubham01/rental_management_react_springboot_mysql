package com.rental.platform.dto;

import com.rental.platform.model.enums.Role;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        Role role,
        boolean active
) {
}

