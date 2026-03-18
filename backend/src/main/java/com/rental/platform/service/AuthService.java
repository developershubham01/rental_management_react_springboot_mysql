package com.rental.platform.service;

import com.rental.platform.dto.AuthRequest;
import com.rental.platform.dto.AuthResponse;
import com.rental.platform.dto.SignupRequest;
import com.rental.platform.dto.UserResponse;
import com.rental.platform.exception.BadRequestException;
import com.rental.platform.model.entity.User;
import com.rental.platform.model.enums.Role;
import com.rental.platform.repository.UserRepository;
import com.rental.platform.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByPhone(request.phone())) {
            throw new BadRequestException("Phone already registered");
        }

        User user = userRepository.save(User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_USER)
                .active(true)
                .build());

        return new AuthResponse(jwtService.generateToken(user), mapUser(user));
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        return new AuthResponse(jwtService.generateToken(user), mapUser(user));
    }

    public UserResponse mapUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive()
        );
    }
}
