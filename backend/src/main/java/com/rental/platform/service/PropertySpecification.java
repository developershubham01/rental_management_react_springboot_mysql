package com.rental.platform.service;

import com.rental.platform.model.entity.Property;
import com.rental.platform.model.enums.ApprovalStatus;
import java.math.BigDecimal;
import org.springframework.data.jpa.domain.Specification;

public final class PropertySpecification {

    private PropertySpecification() {
    }

    public static Specification<Property> approvedProperties(String city, BigDecimal maxPrice, Integer bedrooms, Boolean furnished) {
        return (root, query, cb) -> cb.and(
                cb.equal(root.get("approvalStatus"), ApprovalStatus.APPROVED),
                city == null || city.isBlank()
                        ? cb.conjunction()
                        : cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%"),
                maxPrice == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("price"), maxPrice),
                bedrooms == null
                        ? cb.conjunction()
                        : cb.equal(root.get("bedrooms"), bedrooms),
                furnished == null
                        ? cb.conjunction()
                        : cb.equal(root.get("furnished"), furnished)
        );
    }
}

