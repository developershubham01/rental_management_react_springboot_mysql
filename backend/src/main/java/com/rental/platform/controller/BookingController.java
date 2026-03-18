package com.rental.platform.controller;

import com.rental.platform.dto.BookingRequest;
import com.rental.platform.dto.BookingResponse;
import com.rental.platform.service.BookingService;
import com.rental.platform.service.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final CurrentUserService currentUserService;

    public BookingController(BookingService bookingService, CurrentUserService currentUserService) {
        this.bookingService = bookingService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public BookingResponse createBooking(@Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(currentUserService.getCurrentUser(), request);
    }

    @GetMapping("/mine")
    public List<BookingResponse> myBookings() {
        return bookingService.getUserBookings(currentUserService.getCurrentUser());
    }
}
