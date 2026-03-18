package com.rental.platform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.platform.dto.AIRecommendationRequest;
import com.rental.platform.dto.AIRecommendationResponse;
import com.rental.platform.dto.PropertyResponse;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIRecommendationService {

    private final PropertyService propertyService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIRecommendationService(PropertyService propertyService, RestTemplate restTemplate) {
        this.propertyService = propertyService;
        this.restTemplate = restTemplate;
    }

    @Value("${ai.provider.rapidapi-key:}")
    private String rapidApiKey;

    @Value("${ai.provider.rapidapi-host:}")
    private String rapidApiHost;

    @Value("${ai.provider.url:https://chatgpt-42.p.rapidapi.com/chat}")
    private String aiProviderUrl;

    public AIRecommendationResponse recommend(AIRecommendationRequest request) {
        BigDecimal budget = request.budget() == null ? BigDecimal.valueOf(25000) : request.budget();
        List<PropertyResponse> properties = propertyService.searchProperties(
                        request.city(),
                        budget,
                        request.bedrooms(),
                        request.furnished())
                .stream()
                .limit(5)
                .toList();

        String fallbackSummary = buildFallbackSummary(request, properties);
        if (rapidApiKey.isBlank() || rapidApiHost.isBlank()) {
            return new AIRecommendationResponse(fallbackSummary, properties);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-rapidapi-key", rapidApiKey);
            headers.set("x-rapidapi-host", rapidApiHost);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("messages", List.of(
                    Map.of("role", "system", "content", "You are a rental advisor for Indian real estate. Keep answers concise."),
                    Map.of("role", "user", "content", buildPrompt(request, properties))
            ));
            body.put("web_access", false);

            ResponseEntity<String> response = restTemplate.exchange(
                    aiProviderUrl,
                    HttpMethod.POST,
                    new HttpEntity<>(objectMapper.writeValueAsString(body), headers),
                    String.class
            );

            String summary = extractModelResponse(response.getBody());
            return new AIRecommendationResponse(summary == null || summary.isBlank() ? fallbackSummary : summary, properties);
        } catch (Exception exception) {
            return new AIRecommendationResponse(fallbackSummary, properties);
        }
    }

    private String buildPrompt(AIRecommendationRequest request, List<PropertyResponse> properties) {
        List<String> propertyLines = new ArrayList<>();
        for (PropertyResponse property : properties) {
            propertyLines.add("%s in %s, %s for INR %s, %d BHK, furnished=%s, amenities=%s"
                    .formatted(
                            property.title(),
                            property.locality(),
                            property.city(),
                            property.price(),
                            property.bedrooms(),
                            property.furnished(),
                            property.amenities()
                    ));
        }
        return """
                Recommend the best rental options.
                User city: %s
                Budget: %s
                Bedrooms: %s
                Furnished: %s
                Preferences: %s
                Available properties:
                %s
                Provide a short recommendation summary.
                """.formatted(
                request.city(),
                request.budget(),
                request.bedrooms(),
                request.furnished(),
                request.preferences(),
                String.join("\n", propertyLines)
        );
    }

    private String extractModelResponse(String body) {
        if (body == null || body.isBlank()) {
            return null;
        }
        try {
            JsonNode node = objectMapper.readTree(body);
            if (node.hasNonNull("result")) {
                return node.get("result").asText();
            }
            if (node.hasNonNull("message")) {
                return node.get("message").asText();
            }
            if (node.path("choices").isArray() && !node.path("choices").isEmpty()) {
                return node.path("choices").get(0).path("message").path("content").asText();
            }
        } catch (Exception ignored) {
            return body;
        }
        return null;
    }

    private String buildFallbackSummary(AIRecommendationRequest request, List<PropertyResponse> properties) {
        if (properties.isEmpty()) {
            return "No approved properties matched the requested city, budget, and furnishing preferences.";
        }
        PropertyResponse first = properties.get(0);
        return "Recommended properties in %s under INR %s include %d shortlisted options. The top match is %s in %s with %d bedrooms."
                .formatted(
                        request.city() == null ? first.city() : request.city(),
                        request.budget() == null ? first.price() : request.budget(),
                        properties.size(),
                        first.title(),
                        first.locality(),
                        first.bedrooms()
                );
    }
}
