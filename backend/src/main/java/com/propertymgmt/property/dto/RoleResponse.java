package com.propertymgmt.property.dto;

import com.propertymgmt.property.model.Role;
import java.time.LocalDateTime;

public class RoleResponse {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Long userCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoleResponse() {
    }

    public RoleResponse(Role role) {
        this.id = role.getId();
        this.code = role.getCode();
        this.name = role.getName();
        this.description = role.getDescription();
        this.createdAt = role.getCreatedAt();
        this.updatedAt = role.getUpdatedAt();
        this.userCount = 0L; // Will be set separately if needed
    }

    public RoleResponse(Role role, Long userCount) {
        this(role);
        this.userCount = userCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getUserCount() {
        return userCount;
    }

    public void setUserCount(Long userCount) {
        this.userCount = userCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
