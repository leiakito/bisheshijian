package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.UpdateUserRequest;
import com.propertymgmt.property.dto.UserRequest;
import com.propertymgmt.property.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
    UserResponse toggleUserStatus(Long id);
    void resetPassword(Long id, String newPassword);
}
