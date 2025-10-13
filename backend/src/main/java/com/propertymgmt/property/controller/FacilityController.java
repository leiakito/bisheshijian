package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.model.Facility;
import com.propertymgmt.property.service.FacilityService;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Facility>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(facilityService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Facility>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(facilityService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Facility>> create(@Valid @RequestBody Facility facility) {
        System.out.println("=== 接收到设施创建请求 ===");
        System.out.println("名称: " + facility.getName());
        System.out.println("类型: " + facility.getType());
        System.out.println("位置: " + facility.getLocation());
        System.out.println("状态: " + facility.getStatus());
        System.out.println("上次维护: " + facility.getLastMaintenance());
        System.out.println("下次维护: " + facility.getNextMaintenance());
        System.out.println("负责人: " + facility.getResponsible());

        Facility created = facilityService.create(facility);

        System.out.println("=== 保存后的设施 ===");
        System.out.println("ID: " + created.getId());
        System.out.println("名称: " + created.getName());
        System.out.println("类型: " + created.getType());
        System.out.println("位置: " + created.getLocation());
        System.out.println("状态: " + created.getStatus());
        System.out.println("上次维护: " + created.getLastMaintenance());
        System.out.println("下次维护: " + created.getNextMaintenance());
        System.out.println("负责人: " + created.getResponsible());

        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Facility>> update(
            @PathVariable Long id,
            @Valid @RequestBody Facility facility) {
        System.out.println("=== 接收到设施更新请求 ===");
        System.out.println("设施ID: " + id);
        System.out.println("名称: " + facility.getName());
        System.out.println("类型: " + facility.getType());
        System.out.println("位置: " + facility.getLocation());
        System.out.println("状态: " + facility.getStatus());
        System.out.println("上次维护: " + facility.getLastMaintenance());
        System.out.println("下次维护: " + facility.getNextMaintenance());
        System.out.println("负责人: " + facility.getResponsible());

        Facility updated = facilityService.update(id, facility);

        System.out.println("=== 更新后的设施 ===");
        System.out.println("ID: " + updated.getId());
        System.out.println("名称: " + updated.getName());
        System.out.println("类型: " + updated.getType());
        System.out.println("位置: " + updated.getLocation());
        System.out.println("状态: " + updated.getStatus());
        System.out.println("上次维护: " + updated.getLastMaintenance());
        System.out.println("下次维护: " + updated.getNextMaintenance());
        System.out.println("负责人: " + updated.getResponsible());

        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        System.out.println("=== 接收到设施删除请求 ===");
        System.out.println("设施ID: " + id);

        facilityService.delete(id);

        System.out.println("=== 设施删除成功 ===");

        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
