package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.model.ParkingSpace;
import com.propertymgmt.property.repository.ParkingSpaceRepository;
import com.propertymgmt.property.service.ParkingSpaceService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ParkingSpaceServiceImpl implements ParkingSpaceService {

    private final ParkingSpaceRepository parkingSpaceRepository;

    public ParkingSpaceServiceImpl(ParkingSpaceRepository parkingSpaceRepository) {
        this.parkingSpaceRepository = parkingSpaceRepository;
    }

    @Override
    public List<ParkingSpace> findAll() {
        return parkingSpaceRepository.findAll();
    }

    @Override
    public ParkingSpace findById(Long id) {
        return parkingSpaceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("停车位不存在: " + id));
    }

    @Override
    @Transactional
    public ParkingSpace create(ParkingSpace parkingSpace) {
        return parkingSpaceRepository.save(parkingSpace);
    }

    @Override
    @Transactional
    public ParkingSpace update(Long id, ParkingSpace parkingSpace) {
        ParkingSpace existing = parkingSpaceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("停车位不存在: " + id));

        // 更新字段
        existing.setSpaceNumber(parkingSpace.getSpaceNumber());
        existing.setArea(parkingSpace.getArea());
        existing.setType(parkingSpace.getType());
        existing.setOwner(parkingSpace.getOwner());
        existing.setBuilding(parkingSpace.getBuilding());
        existing.setPlateNumber(parkingSpace.getPlateNumber());
        existing.setStatus(parkingSpace.getStatus());
        existing.setStartDate(parkingSpace.getStartDate());
        existing.setEndDate(parkingSpace.getEndDate());

        return parkingSpaceRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ParkingSpace existing = parkingSpaceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("停车位不存在: " + id));

        parkingSpaceRepository.delete(existing);
    }
}
