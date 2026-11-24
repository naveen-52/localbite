package com.localbite.common.security;

import com.localbite.user.entity.Role;
import com.localbite.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        long accessExpiry = 3600000; // 1 hour
        long refreshExpiry = 86400000; // 24 hours
        jwtUtils = new JwtUtils(testSecret, accessExpiry, refreshExpiry);
    }

    @Test
    @DisplayName("Generate, validate token and extract user id correctly")
    void shouldGenerateAndValidateToken() {
        User user = User.builder()
                .id(42L)
                .fullName("Test Merchant")
                .email("merchant@localbite.com")
                .phoneNumber("+919999988888")
                .passwordHash("hashed")
                .role(Role.SHOP_OWNER)
                .active(true)
                .build();

        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtUtils.generateAccessToken(principal);

        assertNotNull(token);
        assertTrue(jwtUtils.validateToken(token));
        assertEquals(42L, jwtUtils.getUserIdFromToken(token));
    }

    @Test
    @DisplayName("Reject malformed or tampered token")
    void shouldRejectTamperedToken() {
        String invalidToken = "eyJhbGciOiJIUzI1NiJ9.invalidPayload.tamperedSignature";
        assertFalse(jwtUtils.validateToken(invalidToken));
    }
}
