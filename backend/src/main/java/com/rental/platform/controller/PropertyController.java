package com.rental.platform.controller;

import com.rental.platform.dto.PropertyRequest;
import com.rental.platform.dto.PropertyResponse;
import com.rental.platform.service.CurrentUserService;
import com.rental.platform.service.PropertyService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final CurrentUserService currentUserService;

    public PropertyController(PropertyService propertyService, CurrentUserService currentUserService) {
        this.propertyService = propertyService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<PropertyResponse> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Boolean furnished
    ) {
        return propertyService.searchProperties(city, maxPrice, bedrooms, furnished);
    }

    @GetMapping("/{propertyId}")
    public PropertyResponse getProperty(@PathVariable Long propertyId) {
        return propertyService.getProperty(propertyId);
    }

    @GetMapping("/owner/mine")
    public List<PropertyResponse> myProperties() {
        return propertyService.getMyProperties(currentUserService.getCurrentUser());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PropertyResponse createProperty(
            @Valid @RequestPart("property") PropertyRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return propertyService.createProperty(currentUserService.getCurrentUser(), request, images);
    }
}
