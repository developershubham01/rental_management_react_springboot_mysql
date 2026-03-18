package com.rental.platform.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record BookingRequest(
        @NotNull Long propertyId,
        @NotNull @FutureOrPresent LocalDate visitDate,
        @NotNull LocalTime visitTime,
        String note
) {
}

