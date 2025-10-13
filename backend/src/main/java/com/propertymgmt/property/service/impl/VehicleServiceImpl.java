package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.model.Vehicle;
import com.propertymgmt.property.repository.VehicleRepository;
import com.propertymgmt.property.service.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional(readOnly = true)
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public Page<Vehicle> search(String keyword, String type, Pageable pageable) {
        if (StringUtils.hasText(keyword) && StringUtils.hasText(type)) {
            return vehicleRepository.findByKeywordAndType(keyword.trim(), type.trim(), pageable);
        }
        if (StringUtils.hasText(keyword)) {
            return vehicleRepository.findByKeyword(keyword.trim(), pageable);
        }
        if (StringUtils.hasText(type)) {
            return vehicleRepository.findByType(type.trim(), pageable);
        }
        return vehicleRepository.findAll(pageable);
    }
}
