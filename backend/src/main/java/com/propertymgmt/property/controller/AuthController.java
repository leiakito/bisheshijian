package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.dto.LoginRequest;
import com.propertymgmt.property.dto.LoginResponse;
import com.propertymgmt.property.model.Resident;
import com.propertymgmt.property.model.User;
import com.propertymgmt.property.repository.UserRepository;
import com.propertymgmt.property.service.AuthService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.authenticate(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("用户不存在"));

        Map<String, Object> result = new HashMap<>();
        result.put("username", user.getUsername());
        result.put("fullName", user.getFullName());
        result.put("phone", user.getPhone());
        result.put("email", user.getEmail());

        Resident resident = user.getResident();
        if (resident != null) {
            Map<String, Object> residentInfo = new HashMap<>();
            residentInfo.put("id", resident.getId());
            residentInfo.put("name", resident.getName());
            residentInfo.put("phone", resident.getPhone());
            residentInfo.put("building", resident.getBuilding());
            residentInfo.put("unit", resident.getUnit());
            residentInfo.put("roomNumber", resident.getRoomNumber());
            residentInfo.put("area", resident.getArea());
            residentInfo.put("status", resident.getStatus());
            result.put("resident", residentInfo);
        }

        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
