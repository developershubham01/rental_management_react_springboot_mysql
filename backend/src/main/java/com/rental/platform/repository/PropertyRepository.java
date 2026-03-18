package com.rental.platform.repository;

import com.rental.platform.model.entity.Property;
import com.rental.platform.model.entity.User;
import com.rental.platform.model.enums.ApprovalStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    List<Property> findByOwnerOrderByCreatedAtDesc(User owner);

    List<Property> findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus approvalStatus);
}

