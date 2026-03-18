package com.rental.platform.service;

import com.rental.platform.dto.BookingRequest;
import com.rental.platform.dto.BookingResponse;
import com.rental.platform.exception.BadRequestException;
import com.rental.platform.model.entity.Booking;
import com.rental.platform.model.entity.Property;
import com.rental.platform.model.entity.User;
import com.rental.platform.model.enums.ApprovalStatus;
import com.rental.platform.model.enums.BookingStatus;
import com.rental.platform.repository.BookingRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyService propertyService;

    public BookingService(BookingRepository bookingRepository, PropertyService propertyService) {
        this.bookingRepository = bookingRepository;
        this.propertyService = propertyService;
    }

    public BookingResponse createBooking(User user, BookingRequest request) {
        Property property = propertyService.getPropertyEntity(request.propertyId());
        if (property.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new BadRequestException("Property is not available for booking");
        }

        Booking booking = bookingRepository.save(Booking.builder()
                .tenant(user)
                .property(property)
                .visitDate(request.visitDate())
                .visitTime(request.visitTime())
                .note(request.note())
                .status(BookingStatus.PENDING)
                .build());
        return mapBooking(booking);
    }

    public List<BookingResponse> getUserBookings(User user) {
        return bookingRepository.findByTenantOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapBooking)
                .toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapBooking)
                .toList();
    }

    private BookingResponse mapBooking(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getProperty().getId(),
                booking.getProperty().getTitle(),
                booking.getVisitDate(),
                booking.getVisitTime(),
                booking.getStatus(),
                booking.getNote(),
                booking.getCreatedAt()
        );
    }
}
