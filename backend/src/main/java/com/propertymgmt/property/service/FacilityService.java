package com.propertymgmt.property.service;

import com.propertymgmt.property.model.Facility;
import java.util.List;

public interface FacilityService {
    List<Facility> findAll();
    Facility findById(Long id);
    Facility create(Facility facility);
    Facility update(Long id, Facility facility);
    void delete(Long id);
}
