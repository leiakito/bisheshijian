package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.model.ParkingSpace;
import com.propertymgmt.property.service.ParkingSpaceService;
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
@RequestMapping("/api/parking-spaces")
public class ParkingSpaceController {

    private final ParkingSpaceService parkingSpaceService;

    public ParkingSpaceController(ParkingSpaceService parkingSpaceService) {
        this.parkingSpaceService = parkingSpaceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ParkingSpace>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(parkingSpaceService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParkingSpace>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(parkingSpaceService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ParkingSpace>> create(@Valid @RequestBody ParkingSpace parkingSpace) {
        System.out.println("=== 接收到停车位创建请求 ===");
        System.out.println("车位号: " + parkingSpace.getSpaceNumber());
        System.out.println("区域: " + parkingSpace.getArea());
        System.out.println("类型: " + parkingSpace.getType());
        System.out.println("状态: " + parkingSpace.getStatus());

        ParkingSpace created = parkingSpaceService.create(parkingSpace);

        System.out.println("=== 保存后的停车位 ===");
        System.out.println("ID: " + created.getId());
        System.out.println("车位号: " + created.getSpaceNumber());

        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ParkingSpace>> update(
            @PathVariable Long id,
            @Valid @RequestBody ParkingSpace parkingSpace) {
        System.out.println("=== 接收到停车位更新请求 ===");
        System.out.println("停车位ID: " + id);
        System.out.println("车位号: " + parkingSpace.getSpaceNumber());
        System.out.println("状态: " + parkingSpace.getStatus());

        ParkingSpace updated = parkingSpaceService.update(id, parkingSpace);

        System.out.println("=== 更新后的停车位 ===");
        System.out.println("ID: " + updated.getId());
        System.out.println("车位号: " + updated.getSpaceNumber());

        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        System.out.println("=== 接收到停车位删除请求 ===");
        System.out.println("停车位ID: " + id);

        parkingSpaceService.delete(id);

        System.out.println("=== 停车位删除成功 ===");

        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
