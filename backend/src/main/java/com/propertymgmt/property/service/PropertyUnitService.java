package com.propertymgmt.property.service;

import com.propertymgmt.property.model.PropertyUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PropertyUnitService {
    Page<PropertyUnit> search(String keyword, String status, Pageable pageable);
}
