package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.RepairOrder;
import com.propertymgmt.property.model.RepairOrder.RepairStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairOrderRepository extends JpaRepository<RepairOrder, Long> {
    long countByStatus(RepairStatus status);
}
