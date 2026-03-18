package com.rental.platform.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreatePaymentOrderRequest(
        @NotNull Long propertyId,
        @NotNull @DecimalMin("1.0") BigDecimal amount
) {
}

