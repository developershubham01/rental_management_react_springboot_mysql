package com.rental.platform.repository;

import com.rental.platform.model.entity.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
}

