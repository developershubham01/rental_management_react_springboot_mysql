package com.rental.platform.dto;

import com.rental.platform.model.enums.ApprovalStatus;
import com.rental.platform.model.enums.PropertyType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record PropertyResponse(
        Long id,
        String title,
        String description,
        String city,
        String locality,
        String address,
        Double latitude,
        Double longitude,
        BigDecimal price,
        BigDecimal securityDeposit,
        Integer bedrooms,
        Integer bathrooms,
        boolean furnished,
        boolean available,
        PropertyType propertyType,
        ApprovalStatus approvalStatus,
        Set<String> amenities,
        List<String> images,
        UserResponse owner,
        LocalDateTime createdAt
) {
}

