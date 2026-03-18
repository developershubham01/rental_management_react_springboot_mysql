package com.rental.platform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.rental.platform.dto.CreatePaymentOrderRequest;
import com.rental.platform.dto.PaymentOrderResponse;
import com.rental.platform.dto.PaymentResponse;
import com.rental.platform.dto.PaymentVerificationRequest;
import com.rental.platform.exception.BadRequestException;
import com.rental.platform.model.entity.Payment;
import com.rental.platform.model.entity.Property;
import com.rental.platform.model.entity.User;
import com.rental.platform.model.enums.PaymentStatus;
import com.rental.platform.repository.PaymentRepository;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PropertyService propertyService;
    private final RestTemplate restTemplate;

    public PaymentService(
            PaymentRepository paymentRepository,
            PropertyService propertyService,
            RestTemplate restTemplate
    ) {
        this.paymentRepository = paymentRepository;
        this.propertyService = propertyService;
        this.restTemplate = restTemplate;
    }

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    public PaymentOrderResponse createOrder(User user, CreatePaymentOrderRequest request) {
        if (razorpayKeyId.isBlank() || razorpayKeySecret.isBlank()) {
            throw new BadRequestException("Razorpay credentials are not configured");
        }

        Property property = propertyService.getPropertyEntity(request.propertyId());
        long amountInPaise = request.amount().multiply(BigDecimal.valueOf(100)).longValueExact();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(HttpHeaders.AUTHORIZATION, "Basic " + Base64.getEncoder()
                .encodeToString((razorpayKeyId + ":" + razorpayKeySecret).getBytes(StandardCharsets.UTF_8)));

        String payload = """
                {
                  "amount": %d,
                  "currency": "INR",
                  "receipt": "rent-%d-%d",
                  "payment_capture": 1
                }
                """.formatted(amountInPaise, property.getId(), System.currentTimeMillis());

        ResponseEntity<JsonNode> response = restTemplate.exchange(
                "https://api.razorpay.com/v1/orders",
                HttpMethod.POST,
                new HttpEntity<>(payload, headers),
                JsonNode.class
        );

        JsonNode body = response.getBody();
        if (body == null || body.path("id").isMissingNode()) {
            throw new BadRequestException("Failed to create Razorpay order");
        }

        Payment payment = paymentRepository.save(Payment.builder()
                .property(property)
                .tenant(user)
                .amount(request.amount())
                .currency("INR")
                .status(PaymentStatus.CREATED)
                .razorpayOrderId(body.path("id").asText())
                .build());

        return new PaymentOrderResponse(
                payment.getId(),
                payment.getRazorpayOrderId(),
                payment.getAmount(),
                payment.getCurrency(),
                razorpayKeyId,
                payment.getStatus().name()
        );
    }

    public PaymentResponse verifyPayment(User user, PaymentVerificationRequest request) {
        if (razorpayKeySecret.isBlank()) {
            throw new BadRequestException("Razorpay credentials are not configured");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(request.razorpayOrderId())
                .orElseThrow(() -> new BadRequestException("Payment order not found"));
        if (!payment.getTenant().getId().equals(user.getId())) {
            throw new BadRequestException("Payment does not belong to current user");
        }

        String expectedSignature = hmacSha256(request.razorpayOrderId() + "|" + request.razorpayPaymentId(), razorpayKeySecret);
        if (!expectedSignature.equals(request.razorpaySignature())) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Invalid Razorpay signature");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setRazorpayPaymentId(request.razorpayPaymentId());
        payment.setRazorpaySignature(request.razorpaySignature());
        payment.setPaidAt(LocalDateTime.now());
        return mapPayment(paymentRepository.save(payment));
    }

    public List<PaymentResponse> getMyPayments(User user) {
        return paymentRepository.findByTenantOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapPayment)
                .toList();
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::mapPayment)
                .toList();
    }

    public long totalPayments() {
        return paymentRepository.count();
    }

    private PaymentResponse mapPayment(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getProperty().getId(),
                payment.getProperty().getTitle(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                payment.getRazorpayOrderId(),
                payment.getRazorpayPaymentId(),
                payment.getPaidAt(),
                payment.getCreatedAt()
        );
    }

    private String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte value : hash) {
                builder.append(String.format("%02x", value));
            }
            return builder.toString();
        } catch (Exception exception) {
            throw new BadRequestException("Failed to verify payment signature");
        }
    }
}
