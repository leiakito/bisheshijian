package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.service.FeeService;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fees")

public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping("/bills")
    public ResponseEntity<ApiResponse<List<FeeBill>>> bills() {
        return ResponseEntity.ok(ApiResponse.ok(feeService.findAll()));
    }
}
