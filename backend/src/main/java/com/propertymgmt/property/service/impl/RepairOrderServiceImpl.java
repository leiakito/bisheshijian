package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.RepairOrderRequest;
import com.propertymgmt.property.dto.RepairStatusUpdateRequest;
import com.propertymgmt.property.model.RepairOrder;
import com.propertymgmt.property.repository.RepairOrderRepository;
import com.propertymgmt.property.service.RepairOrderService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RepairOrderServiceImpl implements RepairOrderService {

    private final RepairOrderRepository repairOrderRepository;

    public RepairOrderServiceImpl(RepairOrderRepository repairOrderRepository) {
        this.repairOrderRepository = repairOrderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RepairOrder> findAll() {
        return repairOrderRepository.findAll();
    }

    @Override
    public RepairOrder create(RepairOrderRequest request) {
        RepairOrder order = new RepairOrder();
        order.setOrderNumber(generateOrderNumber());
        order.setOwnerName(request.getOwnerName());
        order.setPhone(request.getPhone());
        order.setType(request.getType());
        order.setDescription(request.getDescription());
        order.setBuilding(request.getBuilding());
        order.setUnit(request.getUnit());
        order.setRoomNumber(request.getRoomNumber());
        if (request.getPriority() != null) {
            order.setPriority(RepairOrder.Priority.valueOf(request.getPriority().toUpperCase()));
        }
        order.setStatus(RepairOrder.RepairStatus.PENDING);
        return repairOrderRepository.save(order);
    }

    @Override
    public RepairOrder updateStatus(Long id, RepairStatusUpdateRequest request) {
        RepairOrder order = repairOrderRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("工单不存在"));
        if (request.getStatus() != null) {
            RepairOrder.RepairStatus status = RepairOrder.RepairStatus.valueOf(request.getStatus().toUpperCase());
            order.setStatus(status);
            if (status == RepairOrder.RepairStatus.IN_PROGRESS) {
                order.setStartedAt(LocalDateTime.now());
            }
            if (status == RepairOrder.RepairStatus.COMPLETED) {
                order.setFinishedAt(LocalDateTime.now());
            }
        }
        if (request.getAssignedWorker() != null) {
            order.setAssignedWorker(request.getAssignedWorker());
        }
        if (request.getEvaluationScore() != null) {
            order.setEvaluationScore(request.getEvaluationScore());
            order.setEvaluationRemark(request.getEvaluationRemark());
        }
        return repairOrderRepository.save(order);
    }

    private String generateOrderNumber() {
        return "R" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"))
            + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
    }
}
