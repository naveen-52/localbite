package com.localbite.auth.service;

import com.localbite.auth.dto.AuthResponse;
import com.localbite.auth.dto.RegisterRequest;
import com.localbite.common.exception.BadRequestException;
import com.localbite.common.security.JwtUtils;
import com.localbite.user.entity.Role;
import com.localbite.user.entity.User;
import com.localbite.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    private JwtUtils jwtUtils;
    private AuthService authService;
    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970", 3600000, 86400000);
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, jwtUtils);

        validRequest = new RegisterRequest(
                "Kumar Ramesh",
                "kumar@example.com",
                "+919876543210",
                "Password@123",
                Role.SHOP_OWNER
        );
    }

    @Test
    @DisplayName("Successfully register shop owner and return JWT tokens")
    void shouldRegisterShopOwnerSuccessfully() {
        when(userRepository.existsByEmail("kumar@example.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("+919876543210")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("$2a$12$encodedHashValue");

        User savedUser = User.builder()
                .id(101L)
                .fullName("Kumar Ramesh")
                .email("kumar@example.com")
                .phoneNumber("+919876543210")
                .passwordHash("$2a$12$encodedHashValue")
                .role(Role.SHOP_OWNER)
                .active(true)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponse response = authService.register(validRequest);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals(101L, response.getUserId());
        assertEquals("Kumar Ramesh", response.getFullName());
        assertEquals(Role.SHOP_OWNER, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Fail registration when user attempts to self-assign ADMIN role")
    void shouldRejectAdminSelfRegistration() {
        validRequest.setRole(Role.ADMIN);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                authService.register(validRequest)
        );

        assertTrue(ex.getMessage().contains("Self-registration as ADMIN is strictly prohibited"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Fail registration when email is already registered")
    void shouldRejectDuplicateEmail() {
        when(userRepository.existsByEmail("kumar@example.com")).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                authService.register(validRequest)
        );

        assertTrue(ex.getMessage().contains("email already exists"));
        verify(userRepository, never()).save(any());
    }
}
