package com.localbite.auth.service;

import com.localbite.auth.dto.AuthResponse;
import com.localbite.auth.dto.LoginRequest;
import com.localbite.auth.dto.RegisterRequest;
import com.localbite.common.exception.BadRequestException;
import com.localbite.common.security.JwtUtils;
import com.localbite.common.security.UserPrincipal;
import com.localbite.user.entity.Role;
import com.localbite.user.entity.User;
import com.localbite.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Self-registration as ADMIN is strictly prohibited.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists: " + request.getEmail());
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("An account with this phone number already exists: " + request.getPhoneNumber());
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phoneNumber(request.getPhoneNumber().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user id={} email={} role={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String accessToken = jwtUtils.generateAccessToken(principal);
        String refreshToken = jwtUtils.generateRefreshToken(principal);

        return buildAuthResponse(savedUser, accessToken, refreshToken);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BadRequestException("User profile not found."));

        if (!user.isActive()) {
            throw new BadRequestException("Your account has been deactivated. Please contact support.");
        }

        String accessToken = jwtUtils.generateAccessToken(principal);
        String refreshToken = jwtUtils.generateRefreshToken(principal);

        log.info("User logged in successfully: id={} email={}", user.getId(), user.getEmail());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
}
