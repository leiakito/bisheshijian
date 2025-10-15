package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.UpdateUserRequest;
import com.propertymgmt.property.dto.UserRequest;
import com.propertymgmt.property.dto.UserResponse;
import com.propertymgmt.property.model.Resident;
import com.propertymgmt.property.model.Role;
import com.propertymgmt.property.model.User;
import com.propertymgmt.property.repository.ResidentRepository;
import com.propertymgmt.property.repository.RoleRepository;
import com.propertymgmt.property.repository.UserRepository;
import com.propertymgmt.property.service.UserService;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ResidentRepository residentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                          ResidentRepository residentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.residentRepository = residentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserResponse::new);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        // 检查用户名是否已存在
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("用户名已存在");
        }

        // 获取关联的住户
        Resident resident = residentRepository.findById(request.getResidentId())
            .orElseThrow(() -> new RuntimeException("住户不存在"));

        // 获取角色
        Role role = roleRepository.findById(request.getRoleId())
            .orElseThrow(() -> new RuntimeException("角色不存在"));

        // 验证角色限制 - 只能添加工程人员和普通用户
        if (!"ENGINEER".equals(role.getCode()) && !"USER".equals(role.getCode())) {
            throw new RuntimeException("只能添加工程人员或普通用户");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setResident(resident);
        user.setActive(request.getActive());

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 如果用户名发生变化，检查新用户名是否已存在
        if (!user.getUsername().equals(request.getUsername())) {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new RuntimeException("用户名已存在");
            }
            user.setUsername(request.getUsername());
        }

        // 更新住户关联
        if (request.getResidentId() != null) {
            Resident resident = residentRepository.findById(request.getResidentId())
                .orElseThrow(() -> new RuntimeException("住户不存在"));
            user.setResident(resident);
        }

        // 更新角色
        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("角色不存在"));

            // 验证角色限制
            if (!"ENGINEER".equals(role.getCode()) && !"USER".equals(role.getCode())) {
                throw new RuntimeException("只能设置为工程人员或普通用户");
            }

            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
        }

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setActive(request.getActive());

        User updatedUser = userRepository.save(user);
        return new UserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
        user.setActive(!user.getActive());
        User updatedUser = userRepository.save(user);
        return new UserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
