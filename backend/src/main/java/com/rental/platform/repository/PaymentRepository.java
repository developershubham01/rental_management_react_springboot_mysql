package com.rental.platform.repository;

import com.rental.platform.model.entity.Payment;
import com.rental.platform.model.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTenantOrderByCreatedAtDesc(User tenant);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}

