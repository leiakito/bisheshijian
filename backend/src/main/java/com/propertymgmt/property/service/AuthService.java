package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.LoginRequest;
import com.propertymgmt.property.dto.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(LoginRequest request);
}
