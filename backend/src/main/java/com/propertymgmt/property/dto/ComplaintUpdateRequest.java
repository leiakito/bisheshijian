package com.propertymgmt.property.dto;

import jakarta.validation.constraints.NotBlank;

public class ComplaintUpdateRequest {

    @NotBlank
    private String status;

    private String processedBy;

    private String reply;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProcessedBy() {
        return processedBy;
    }

    public void setProcessedBy(String processedBy) {
        this.processedBy = processedBy;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}
