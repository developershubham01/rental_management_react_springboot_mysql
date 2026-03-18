package com.rental.platform.dto;

import com.rental.platform.model.enums.ApprovalStatus;
import jakarta.validation.constraints.NotNull;

public record ApprovalRequest(
        @NotNull ApprovalStatus approvalStatus
) {
}

