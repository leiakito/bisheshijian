package com.propertymgmt.property.dto;

import jakarta.validation.constraints.NotBlank;

public class RepairStatusUpdateRequest {

    @NotBlank
    private String status;

    private String assignedWorker;

    private Integer evaluationScore;

    private String evaluationRemark;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedWorker() {
        return assignedWorker;
    }

    public void setAssignedWorker(String assignedWorker) {
        this.assignedWorker = assignedWorker;
    }

    public Integer getEvaluationScore() {
        return evaluationScore;
    }

    public void setEvaluationScore(Integer evaluationScore) {
        this.evaluationScore = evaluationScore;
    }

    public String getEvaluationRemark() {
        return evaluationRemark;
    }

    public void setEvaluationRemark(String evaluationRemark) {
        this.evaluationRemark = evaluationRemark;
    }
}
