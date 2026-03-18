package com.rental.platform.dto;

import java.math.BigDecimal;
import java.util.List;

public record AIRecommendationRequest(
        String city,
        BigDecimal budget,
        Integer bedrooms,
        Boolean furnished,
        List<String> preferences
) {
}

