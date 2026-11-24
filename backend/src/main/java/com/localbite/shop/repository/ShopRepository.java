package com.localbite.shop.repository;

import com.localbite.shop.entity.Shop;
import com.localbite.shop.entity.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    Optional<Shop> findBySlug(String slug);

    Optional<Shop> findByOwnerId(Long ownerId);

    boolean existsBySlug(String slug);

    boolean existsByOwnerId(Long ownerId);

    Page<Shop> findByVerificationStatus(VerificationStatus status, Pageable pageable);

    long countByVerificationStatus(VerificationStatus status);

    /**
     * Finds nearby approved shops using the spherical law of cosines (Haversine approximation).
     * Calculates distance in kilometers and filters within the given radius.
     */
    @Query(value = """
            SELECT s.*, 
            (6371 * acos(
                cos(radians(:userLat)) * cos(radians(s.latitude)) * 
                cos(radians(s.longitude) - radians(:userLng)) + 
                sin(radians(:userLat)) * sin(radians(s.latitude))
            )) AS distance
            FROM shops s
            WHERE s.verification_status = 'APPROVED'
            HAVING distance <= :radiusKm
            ORDER BY distance ASC
            """, nativeQuery = true)
    List<Shop> findNearbyShops(
            @Param("userLat") double userLat,
            @Param("userLng") double userLng,
            @Param("radiusKm") double radiusKm
    );
}
