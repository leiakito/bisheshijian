package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.dto.ComplaintRequest;
import com.propertymgmt.property.model.Complaint;
import com.propertymgmt.property.service.ComplaintService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Complaint>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Complaint>> create(@Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.create(request)));
    }
}
