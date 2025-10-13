package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.dto.RepairOrderRequest;
import com.propertymgmt.property.dto.RepairStatusUpdateRequest;
import com.propertymgmt.property.model.RepairOrder;
import com.propertymgmt.property.service.RepairOrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/repairs")
public class RepairOrderController {
    private final RepairOrderService repairOrderService;

    public RepairOrderController(RepairOrderService repairOrderService) {
        this.repairOrderService = repairOrderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RepairOrder>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(repairOrderService.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RepairOrder>> create(@Valid @RequestBody RepairOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(repairOrderService.create(request)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RepairOrder>> updateStatus(@PathVariable Long id,
                                                                 @Valid @RequestBody RepairStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(repairOrderService.updateStatus(id, request)));
    }
}
