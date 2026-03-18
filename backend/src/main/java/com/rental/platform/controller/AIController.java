package com.rental.platform.controller;

import com.rental.platform.dto.AIRecommendationRequest;
import com.rental.platform.dto.AIRecommendationResponse;
import com.rental.platform.service.AIRecommendationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIRecommendationService aiRecommendationService;

    public AIController(AIRecommendationService aiRecommendationService) {
        this.aiRecommendationService = aiRecommendationService;
    }

    @PostMapping("/recommendations")
    public AIRecommendationResponse recommend(@RequestBody AIRecommendationRequest request) {
        return aiRecommendationService.recommend(request);
    }
}
