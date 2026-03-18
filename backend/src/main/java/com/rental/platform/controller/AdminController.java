package com.rental.platform.controller;

import com.rental.platform.dto.AdminDashboardResponse;
import com.rental.platform.dto.ApprovalRequest;
import com.rental.platform.dto.BookingResponse;
import com.rental.platform.dto.PaymentResponse;
import com.rental.platform.dto.PropertyResponse;
import com.rental.platform.dto.UserResponse;
import com.rental.platform.service.AdminService;
import com.rental.platform.service.BookingService;
import com.rental.platform.service.PaymentService;
import com.rental.platform.service.PropertyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final PropertyService propertyService;
    private final BookingService bookingService;
    private final PaymentService paymentService;

    public AdminController(
            AdminService adminService,
            PropertyService propertyService,
            BookingService bookingService,
            PaymentService paymentService
    ) {
        this.adminService = adminService;
        this.propertyService = propertyService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return adminService.getUsers();
    }

    @PatchMapping("/users/{userId}/toggle")
    public UserResponse toggleUser(@PathVariable Long userId) {
        return adminService.toggleUserStatus(userId);
    }

    @GetMapping("/properties/pending")
    public List<PropertyResponse> pendingProperties() {
        return propertyService.getPendingProperties();
    }

    @PatchMapping("/properties/{propertyId}/approval")
    public PropertyResponse approveProperty(
            @PathVariable Long propertyId,
            @Valid @RequestBody ApprovalRequest request
    ) {
        return propertyService.updateApproval(propertyId, request.approvalStatus());
    }

    @GetMapping("/bookings")
    public List<BookingResponse> bookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/payments")
    public List<PaymentResponse> payments() {
        return paymentService.getAllPayments();
    }
}
