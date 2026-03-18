package com.rental.platform.dto;

import java.math.BigDecimal;

public record PaymentOrderResponse(
        Long paymentId,
        String orderId,
        BigDecimal amount,
        String currency,
        String razorpayKey,
        String status
) {
}

