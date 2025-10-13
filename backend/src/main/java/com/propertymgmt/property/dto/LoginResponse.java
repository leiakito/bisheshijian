package com.propertymgmt.property.dto;

import java.util.List;

public class LoginResponse {
    private final String token;
    private final String tokenType;
    private final long expiresIn;
    private final String username;
    private final String displayName;
    private final List<String> roles;

    public LoginResponse(String token,
                         String tokenType,
                         long expiresIn,
                         String username,
                         String displayName,
                         List<String> roles) {
        this.token = token;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.username = username;
        this.displayName = displayName;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public List<String> getRoles() {
        return roles;
    }
}
