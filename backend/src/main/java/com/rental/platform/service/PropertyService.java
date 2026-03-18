package com.rental.platform.service;

import com.rental.platform.dto.PropertyRequest;
import com.rental.platform.dto.PropertyResponse;
import com.rental.platform.dto.UserResponse;
import com.rental.platform.exception.ResourceNotFoundException;
import com.rental.platform.model.entity.Property;
import com.rental.platform.model.entity.PropertyImage;
import com.rental.platform.model.entity.User;
import com.rental.platform.model.enums.ApprovalStatus;
import com.rental.platform.repository.PropertyImageRepository;
import com.rental.platform.repository.PropertyRepository;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final StorageService storageService;
    private final AuthService authService;

    public PropertyService(
            PropertyRepository propertyRepository,
            PropertyImageRepository propertyImageRepository,
            StorageService storageService,
            AuthService authService
    ) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.storageService = storageService;
        this.authService = authService;
    }

    @Transactional
    public PropertyResponse createProperty(User owner, PropertyRequest request, List<MultipartFile> images) {
        Property property = Property.builder()
                .title(request.title())
                .description(request.description())
                .city(request.city())
                .locality(request.locality())
                .address(request.address())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .price(request.price())
                .securityDeposit(request.securityDeposit())
                .bedrooms(request.bedrooms())
                .bathrooms(request.bathrooms())
                .furnished(request.furnished())
                .available(true)
                .propertyType(request.propertyType())
                .approvalStatus(ApprovalStatus.PENDING)
                .owner(owner)
                .amenities(request.amenities() == null ? Collections.emptySet() : request.amenities().stream()
                        .filter(Objects::nonNull)
                        .collect(Collectors.toCollection(java.util.LinkedHashSet::new)))
                .build();

        Property savedProperty = propertyRepository.save(property);
        if (images != null) {
            for (int i = 0; i < images.size(); i++) {
                String imageUrl = storageService.store(images.get(i));
                PropertyImage savedImage = propertyImageRepository.save(PropertyImage.builder()
                        .imageUrl(imageUrl)
                        .isPrimary(i == 0)
                        .property(savedProperty)
                        .build());
                savedProperty.getImages().add(savedImage);
            }
        }
        return mapProperty(getPropertyEntity(savedProperty.getId()));
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> searchProperties(String city, BigDecimal maxPrice, Integer bedrooms, Boolean furnished) {
        return propertyRepository.findAll(
                        PropertySpecification.approvedProperties(city, maxPrice, bedrooms, furnished),
                        Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::mapProperty)
                .toList();
    }

    @Transactional(readOnly = true)
    public PropertyResponse getProperty(Long id) {
        return mapProperty(getPropertyEntity(id));
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getMyProperties(User user) {
        return propertyRepository.findByOwnerOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapProperty)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getPendingProperties() {
        return propertyRepository.findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus.PENDING)
                .stream()
                .map(this::mapProperty)
                .toList();
    }

    @Transactional
    public PropertyResponse updateApproval(Long propertyId, ApprovalStatus approvalStatus) {
        Property property = getPropertyEntity(propertyId);
        property.setApprovalStatus(approvalStatus);
        return mapProperty(propertyRepository.save(property));
    }

    public long totalProperties() {
        return propertyRepository.count();
    }

    public Property getPropertyEntity(Long propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
    }

    public PropertyResponse mapProperty(Property property) {
        property.getImages().size();
        List<String> imageUrls = property.getImages().stream()
                .map(PropertyImage::getImageUrl)
                .toList();
        UserResponse owner = authService.mapUser(property.getOwner());
        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getCity(),
                property.getLocality(),
                property.getAddress(),
                property.getLatitude(),
                property.getLongitude(),
                property.getPrice(),
                property.getSecurityDeposit(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.isFurnished(),
                property.isAvailable(),
                property.getPropertyType(),
                property.getApprovalStatus(),
                property.getAmenities(),
                imageUrls,
                owner,
                property.getCreatedAt()
        );
    }
}
