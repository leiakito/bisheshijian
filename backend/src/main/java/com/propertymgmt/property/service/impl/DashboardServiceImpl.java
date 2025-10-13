package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.DashboardSummary;
import com.propertymgmt.property.model.Complaint;
import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.model.PropertyUnit;
import com.propertymgmt.property.model.RepairOrder;
import com.propertymgmt.property.repository.ComplaintRepository;
import com.propertymgmt.property.repository.FeeBillRepository;
import com.propertymgmt.property.repository.PropertyUnitRepository;
import com.propertymgmt.property.repository.RepairOrderRepository;
import com.propertymgmt.property.repository.ResidentRepository;
import com.propertymgmt.property.service.DashboardService;
import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

@Service

public class DashboardServiceImpl implements DashboardService {

    private final ResidentRepository residentRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final ComplaintRepository complaintRepository;
    private final FeeBillRepository feeBillRepository;
    private final PropertyUnitRepository propertyUnitRepository;

    public DashboardServiceImpl(ResidentRepository residentRepository, RepairOrderRepository repairOrderRepository, ComplaintRepository complaintRepository, FeeBillRepository feeBillRepository, PropertyUnitRepository propertyUnitRepository) {
        this.residentRepository = residentRepository;
        this.repairOrderRepository = repairOrderRepository;
        this.complaintRepository = complaintRepository;
        this.feeBillRepository = feeBillRepository;
        this.propertyUnitRepository = propertyUnitRepository;
    }


    @Override
    public DashboardSummary getSummary() {
        long totalResidents = residentRepository.count();
        long pendingRepairs = repairOrderRepository.countByStatus(RepairOrder.RepairStatus.PENDING)
            + repairOrderRepository.countByStatus(RepairOrder.RepairStatus.IN_PROGRESS);
        long pendingComplaints = complaintRepository.countByStatus(Complaint.ComplaintStatus.RECEIVED)
            + complaintRepository.countByStatus(Complaint.ComplaintStatus.PROCESSING);
        BigDecimal monthlyIncome = feeBillRepository.sumPaidAmount();

        long totalUnits = propertyUnitRepository.count();
        long occupiedUnits = propertyUnitRepository.countByStatus(PropertyUnit.UnitStatus.OCCUPIED);
        long totalBills = feeBillRepository.count();
        long paidBills = feeBillRepository.countByStatus(FeeBill.BillStatus.PAID);

        double occupancyRate = totalUnits == 0 ? 0D : round(((double) occupiedUnits / totalUnits) * 100, 2);
        double paymentRate = totalBills == 0 ? 0D : round(((double) paidBills / totalBills) * 100, 2);

        return DashboardSummary.builder()
            .totalResidents(totalResidents)
            .pendingRepairs(pendingRepairs)
            .pendingComplaints(pendingComplaints)
            .monthlyIncome(monthlyIncome)
            .occupancyRate(occupancyRate)
            .paymentRate(paymentRate)
            .build();
    }

    private double round(double value, int scale) {
        return BigDecimal.valueOf(value).setScale(scale, RoundingMode.HALF_UP).doubleValue();
    }
}
