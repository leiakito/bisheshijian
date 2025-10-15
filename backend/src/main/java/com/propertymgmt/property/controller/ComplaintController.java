package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.dto.ComplaintRequest;
import com.propertymgmt.property.dto.ComplaintUpdateRequest;
import com.propertymgmt.property.model.Complaint;
import com.propertymgmt.property.service.ComplaintService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Complaint>>> list(
            @RequestParam(required = false) String ownerName) {
        if (ownerName != null && !ownerName.isEmpty()) {
            // 如果提供了业主姓名，筛选该业主的投诉记录
            List<Complaint> allComplaints = complaintService.findAll();
            List<Complaint> filtered = allComplaints.stream()
                .filter(complaint -> ownerName.equals(complaint.getOwnerName()))
                .toList();
            return ResponseEntity.ok(ApiResponse.ok(filtered));
        }
        return ResponseEntity.ok(ApiResponse.ok(complaintService.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Complaint>> create(@Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.create(request)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Complaint>> updateStatus(@PathVariable Long id,
                                                                 @Valid @RequestBody ComplaintUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.updateStatus(id, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Complaint>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.findById(id)));
    }
}
