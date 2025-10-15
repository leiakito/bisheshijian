package com.propertymgmt.property.dto;

import jakarta.validation.constraints.NotBlank;

public class GenerateBillsRequest {

    @NotBlank(message = "账期不能为空")
    private String billingPeriod;

    public String getBillingPeriod() {
        return billingPeriod;
    }

    public void setBillingPeriod(String billingPeriod) {
        this.billingPeriod = billingPeriod;
    }
}
