package com.rental.platform.dto;

import com.rental.platform.model.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long propertyId,
        String propertyTitle,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        String razorpayOrderId,
        String razorpayPaymentId,
        LocalDateTime paidAt,
        LocalDateTime createdAt
) {
}

