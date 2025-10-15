package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.RoleRequest;
import com.propertymgmt.property.dto.RoleResponse;
import com.propertymgmt.property.model.Role;
import com.propertymgmt.property.repository.RoleRepository;
import com.propertymgmt.property.service.RoleService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
            .map(role -> {
                Long userCount = getUserCountByRoleId(role.getId());
                return new RoleResponse(role, userCount);
            })
            .collect(Collectors.toList());
    }

    @Override
    public RoleResponse getRoleById(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("角色不存在"));
        Long userCount = getUserCountByRoleId(id);
        return new RoleResponse(role, userCount);
    }

    @Override
    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        // 检查角色编码是否已存在
        if (roleRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("角色编码已存在");
        }

        Role role = new Role();
        role.setCode(request.getCode());
        role.setName(request.getName());
        role.setDescription(request.getDescription());

        Role savedRole = roleRepository.save(role);
        return new RoleResponse(savedRole, 0L);
    }

    @Override
    @Transactional
    public RoleResponse updateRole(Long id, RoleRequest request) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("角色不存在"));

        // 检查是否是系统预设角色（ADMIN、USER、ENGINEER）
        if ("ADMIN".equals(role.getCode()) || "USER".equals(role.getCode()) || "ENGINEER".equals(role.getCode())) {
            throw new RuntimeException("系统预设角色不允许修改");
        }

        // 如果角色编码发生变化，检查新编码是否已存在
        if (!role.getCode().equals(request.getCode())) {
            if (roleRepository.findByCode(request.getCode()).isPresent()) {
                throw new RuntimeException("角色编码已存在");
            }
            role.setCode(request.getCode());
        }

        role.setName(request.getName());
        role.setDescription(request.getDescription());

        Role updatedRole = roleRepository.save(role);
        Long userCount = getUserCountByRoleId(id);
        return new RoleResponse(updatedRole, userCount);
    }

    @Override
    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("角色不存在"));

        // 检查是否是系统预设角色
        if ("ADMIN".equals(role.getCode()) || "USER".equals(role.getCode()) || "ENGINEER".equals(role.getCode())) {
            throw new RuntimeException("系统预设角色不允许删除");
        }

        // 检查是否有用户使用该角色
        Long userCount = getUserCountByRoleId(id);
        if (userCount > 0) {
            throw new RuntimeException("该角色下还有 " + userCount + " 个用户，无法删除");
        }

        roleRepository.delete(role);
    }

    private Long getUserCountByRoleId(Long roleId) {
        String sql = "SELECT COUNT(*) FROM sys_user_roles WHERE role_id = :roleId";
        Number result = (Number) entityManager.createNativeQuery(sql)
            .setParameter("roleId", roleId)
            .getSingleResult();
        return result.longValue();
    }
}
