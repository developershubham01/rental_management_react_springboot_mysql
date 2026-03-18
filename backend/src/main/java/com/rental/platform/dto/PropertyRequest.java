package com.rental.platform.dto;

import com.rental.platform.model.enums.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record PropertyRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String city,
        @NotBlank String locality,
        @NotBlank String address,
        Double latitude,
        Double longitude,
        @NotNull @DecimalMin("1.0") BigDecimal price,
        @DecimalMin("0.0") BigDecimal securityDeposit,
        @NotNull @Min(0) Integer bedrooms,
        @NotNull @Min(1) Integer bathrooms,
        boolean furnished,
        boolean available,
        @NotNull PropertyType propertyType,
        List<String> amenities
) {
}

