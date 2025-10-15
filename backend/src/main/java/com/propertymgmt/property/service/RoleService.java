package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.RoleRequest;
import com.propertymgmt.property.dto.RoleResponse;
import java.util.List;

public interface RoleService {
    List<RoleResponse> getAllRoles();
    RoleResponse getRoleById(Long id);
    RoleResponse createRole(RoleRequest request);
    RoleResponse updateRole(Long id, RoleRequest request);
    void deleteRole(Long id);
}
