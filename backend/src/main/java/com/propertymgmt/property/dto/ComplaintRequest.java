package com.propertymgmt.property.dto;

import jakarta.validation.constraints.NotBlank;

public class ComplaintRequest {

    @NotBlank
    private String ownerName;

    @NotBlank
    private String phone;

    @NotBlank
    private String type;

    @NotBlank
    private String description;

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
