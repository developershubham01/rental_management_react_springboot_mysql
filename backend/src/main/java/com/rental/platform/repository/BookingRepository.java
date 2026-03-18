package com.rental.platform.repository;

import com.rental.platform.model.entity.Booking;
import com.rental.platform.model.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTenantOrderByCreatedAtDesc(User tenant);
}

