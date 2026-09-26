package com.example.core_service.dto;

import java.util.List;

public class RecommendationResponse {
    private boolean success;
    private Long studentProfileId;
    private List<SchemeMatch> recommendations;
    private String reason;

    public static class SchemeMatch {
        private Long schemeId;
        private String title;
        private Double matchScore; // 0 - 100%
        private String matchReason;
        private Double scholarshipAmount;
        private String category;

        public SchemeMatch() {}

        public Long getSchemeId() {
            return schemeId;
        }

        public void setSchemeId(Long schemeId) {
            this.schemeId = schemeId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Double getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(Double matchScore) {
            this.matchScore = matchScore;
        }

        public String getMatchReason() {
            return matchReason;
        }

        public void setMatchReason(String matchReason) {
            this.matchReason = matchReason;
        }

        public Double getScholarshipAmount() {
            return scholarshipAmount;
        }

        public void setScholarshipAmount(Double scholarshipAmount) {
            this.scholarshipAmount = scholarshipAmount;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    public RecommendationResponse() {}

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Long getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(Long studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public List<SchemeMatch> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<SchemeMatch> recommendations) {
        this.recommendations = recommendations;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
