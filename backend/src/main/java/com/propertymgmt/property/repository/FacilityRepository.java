package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
}
