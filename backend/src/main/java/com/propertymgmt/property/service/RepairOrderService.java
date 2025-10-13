package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.RepairOrderRequest;
import com.propertymgmt.property.dto.RepairStatusUpdateRequest;
import com.propertymgmt.property.model.RepairOrder;
import java.util.List;

public interface RepairOrderService {
    List<RepairOrder> findAll();
    RepairOrder create(RepairOrderRequest request);
    RepairOrder updateStatus(Long id, RepairStatusUpdateRequest request);
}
