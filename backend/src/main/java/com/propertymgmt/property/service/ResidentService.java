package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.ResidentRequest;
import com.propertymgmt.property.model.Resident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResidentService {
    Page<Resident> search(String keyword, String status, Pageable pageable);
    Resident create(ResidentRequest request);
    Resident update(Long id, ResidentRequest request);
    void delete(Long id);
}
