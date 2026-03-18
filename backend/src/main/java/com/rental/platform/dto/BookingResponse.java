package com.rental.platform.dto;

import com.rental.platform.model.enums.BookingStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BookingResponse(
        Long id,
        Long propertyId,
        String propertyTitle,
        LocalDate visitDate,
        LocalTime visitTime,
        BookingStatus status,
        String note,
        LocalDateTime createdAt
) {
}

