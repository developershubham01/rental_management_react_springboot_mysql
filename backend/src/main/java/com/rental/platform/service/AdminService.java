package com.rental.platform.service;

import com.rental.platform.dto.AdminDashboardResponse;
import com.rental.platform.dto.UserResponse;
import com.rental.platform.exception.ResourceNotFoundException;
import com.rental.platform.model.entity.User;
import com.rental.platform.model.enums.ApprovalStatus;
import com.rental.platform.repository.PropertyRepository;
import com.rental.platform.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final AuthService authService;
    private final PaymentService paymentService;

    public AdminService(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            AuthService authService,
            PaymentService paymentService
    ) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.authService = authService;
        this.paymentService = paymentService;
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(authService::mapUser)
                .toList();
    }

    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        return authService.mapUser(userRepository.save(user));
    }

    public AdminDashboardResponse dashboard() {
        return new AdminDashboardResponse(
                userRepository.count(),
                propertyRepository.count(),
                propertyRepository.findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus.PENDING).size(),
                paymentService.totalPayments()
        );
    }
}
