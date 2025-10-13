package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.model.Facility;
import com.propertymgmt.property.repository.FacilityRepository;
import com.propertymgmt.property.service.FacilityService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityServiceImpl(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    @Override
    public List<Facility> findAll() {
        return facilityRepository.findAll();
    }

    @Override
    public Facility findById(Long id) {
        return facilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("设施不存在: " + id));
    }

    @Override
    @Transactional
    public Facility create(Facility facility) {
        return facilityRepository.save(facility);
    }

    @Override
    @Transactional
    public Facility update(Long id, Facility facility) {
        Facility existing = facilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("设施不存在: " + id));

        // 更新字段
        existing.setName(facility.getName());
        existing.setType(facility.getType());
        existing.setLocation(facility.getLocation());
        existing.setStatus(facility.getStatus());
        existing.setLastMaintenance(facility.getLastMaintenance());
        existing.setNextMaintenance(facility.getNextMaintenance());
        existing.setResponsible(facility.getResponsible());

        return facilityRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Facility existing = facilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("设施不存在: " + id));

        facilityRepository.delete(existing);
    }
}
