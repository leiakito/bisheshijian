package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.dto.ResidentRequest;
import com.propertymgmt.property.model.Resident;
import com.propertymgmt.property.service.ResidentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/residents")
public class ResidentController {

    private final ResidentService residentService;

    public ResidentController(ResidentService residentService) {
        this.residentService = residentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Resident>>> list(@RequestParam(required = false) String keyword,
                                                            @RequestParam(required = false) String status,
                                                            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(residentService.search(keyword, status, pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Resident>> create(@Valid @RequestBody ResidentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(residentService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Resident>> update(@PathVariable Long id,
                                                        @Valid @RequestBody ResidentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(residentService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        residentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
