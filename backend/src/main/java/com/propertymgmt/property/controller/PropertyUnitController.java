package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.model.PropertyUnit;
import com.propertymgmt.property.service.PropertyUnitService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/property-units")

public class PropertyUnitController {

    private final PropertyUnitService propertyUnitService;

    public PropertyUnitController(PropertyUnitService propertyUnitService) {
        this.propertyUnitService = propertyUnitService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PropertyUnit>>> list(@RequestParam(required = false) String keyword,
                                                                @RequestParam(required = false) String status,
                                                                @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(propertyUnitService.search(keyword, status, pageable)));
    }
}
