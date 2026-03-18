package com.rental.platform.dto;

import java.util.List;

public record AIRecommendationResponse(
        String summary,
        List<PropertyResponse> recommendedProperties
) {
}

