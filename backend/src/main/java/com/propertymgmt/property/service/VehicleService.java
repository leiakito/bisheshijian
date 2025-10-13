package com.propertymgmt.property.service;

import com.propertymgmt.property.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {
    Page<Vehicle> search(String keyword, String type, Pageable pageable);
}
