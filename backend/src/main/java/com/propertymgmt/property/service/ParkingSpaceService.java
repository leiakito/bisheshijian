package com.propertymgmt.property.service;

import com.propertymgmt.property.model.ParkingSpace;
import java.util.List;

public interface ParkingSpaceService {
    List<ParkingSpace> findAll();
    ParkingSpace findById(Long id);
    ParkingSpace create(ParkingSpace parkingSpace);
    ParkingSpace update(Long id, ParkingSpace parkingSpace);
    void delete(Long id);
}
