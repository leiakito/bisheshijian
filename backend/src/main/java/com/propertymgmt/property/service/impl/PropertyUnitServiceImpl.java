package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.model.PropertyUnit;
import com.propertymgmt.property.repository.PropertyUnitRepository;
import com.propertymgmt.property.service.PropertyUnitService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service

@Transactional(readOnly = true)
public class PropertyUnitServiceImpl implements PropertyUnitService {

    private final PropertyUnitRepository propertyUnitRepository;

    public PropertyUnitServiceImpl(PropertyUnitRepository propertyUnitRepository) {
        this.propertyUnitRepository = propertyUnitRepository;
    }

    @Override
    public Page<PropertyUnit> search(String keyword, String status, Pageable pageable) {
        PropertyUnit.UnitStatus unitStatus = null;
        if (StringUtils.hasText(status)) {
            unitStatus = PropertyUnit.UnitStatus.valueOf(status.trim().toUpperCase());
        }

        if (StringUtils.hasText(keyword) && unitStatus != null) {
            return propertyUnitRepository.findByKeywordAndStatus(keyword.trim(), unitStatus, pageable);
        }
        if (StringUtils.hasText(keyword)) {
            return propertyUnitRepository.findByKeyword(keyword.trim(), pageable);
        }
        if (unitStatus != null) {
            return propertyUnitRepository.findByStatus(unitStatus, pageable);
        }
        return propertyUnitRepository.findAll(pageable);
    }
}
