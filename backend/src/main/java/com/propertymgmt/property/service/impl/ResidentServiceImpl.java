package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.ResidentRequest;
import com.propertymgmt.property.model.Resident;
import com.propertymgmt.property.repository.ResidentRepository;
import com.propertymgmt.property.service.ResidentService;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class ResidentServiceImpl implements ResidentService {

    private final ResidentRepository residentRepository;

    public ResidentServiceImpl(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Resident> search(String keyword, String status, Pageable pageable) {
        Resident.Status residentStatus = null;
        if (StringUtils.hasText(status)) {
            residentStatus = Resident.Status.valueOf(status.trim().toUpperCase());
        }

        if (StringUtils.hasText(keyword) && residentStatus != null) {
            return residentRepository.searchByKeywordAndStatus(keyword.trim(), residentStatus, pageable);
        }
        if (StringUtils.hasText(keyword)) {
            return residentRepository.searchByKeyword(keyword.trim(), pageable);
        }
        if (residentStatus != null) {
            return residentRepository.findByStatus(residentStatus, pageable);
        }
        return residentRepository.findAll(pageable);
    }

    @Override
    public Resident create(ResidentRequest request) {
        Resident resident = new Resident();
        applyRequest(request, resident);
        // 如果没有提供入住日期，使用当前日期
        if (resident.getMoveInDate() == null) {
            resident.setMoveInDate(LocalDate.now());
        }
        return residentRepository.save(resident);
    }

    @Override
    public Resident update(Long id, ResidentRequest request) {
        Resident resident = residentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("住户不存在"));
        applyRequest(request, resident);
        return residentRepository.save(resident);
    }

    @Override
    public void delete(Long id) {
        residentRepository.deleteById(id);
    }

    private void applyRequest(ResidentRequest request, Resident resident) {
        resident.setName(request.getName());
        resident.setPhone(request.getPhone());
        resident.setIdCard(request.getIdCard());
        resident.setBuilding(request.getBuilding());
        resident.setUnit(request.getUnit());
        resident.setRoomNumber(request.getRoomNumber());
        resident.setArea(request.getArea());

        // 设置居住类型
        if (StringUtils.hasText(request.getResidenceType())) {
            resident.setResidenceType(Resident.ResidenceType.valueOf(request.getResidenceType().toUpperCase()));
        }

        // 设置状态
        if (StringUtils.hasText(request.getStatus())) {
            resident.setStatus(Resident.Status.valueOf(request.getStatus().toUpperCase()));
        }

        // 设置入住日期
        if (StringUtils.hasText(request.getMoveInDate())) {
            resident.setMoveInDate(LocalDate.parse(request.getMoveInDate()));
        }

        // 设置紧急联系信息
        resident.setEmergencyContact(request.getEmergencyContact());
        resident.setEmergencyPhone(request.getEmergencyPhone());
        resident.setRemark(request.getRemark());
    }
}
