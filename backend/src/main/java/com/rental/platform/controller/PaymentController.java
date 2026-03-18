package com.rental.platform.controller;

import com.rental.platform.dto.CreatePaymentOrderRequest;
import com.rental.platform.dto.PaymentOrderResponse;
import com.rental.platform.dto.PaymentResponse;
import com.rental.platform.dto.PaymentVerificationRequest;
import com.rental.platform.service.CurrentUserService;
import com.rental.platform.service.PaymentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final CurrentUserService currentUserService;

    public PaymentController(PaymentService paymentService, CurrentUserService currentUserService) {
        this.paymentService = paymentService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/order")
    public PaymentOrderResponse createOrder(@Valid @RequestBody CreatePaymentOrderRequest request) {
        return paymentService.createOrder(currentUserService.getCurrentUser(), request);
    }

    @PostMapping("/verify")
    public PaymentResponse verify(@Valid @RequestBody PaymentVerificationRequest request) {
        return paymentService.verifyPayment(currentUserService.getCurrentUser(), request);
    }

    @GetMapping("/mine")
    public List<PaymentResponse> myPayments() {
        return paymentService.getMyPayments(currentUserService.getCurrentUser());
    }
}
