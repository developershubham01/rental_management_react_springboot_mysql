package com.rental.platform.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}

