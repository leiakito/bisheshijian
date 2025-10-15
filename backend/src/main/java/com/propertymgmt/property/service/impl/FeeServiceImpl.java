package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.BillRequest;
import com.propertymgmt.property.dto.FeeItemRequest;
import com.propertymgmt.property.dto.FeeStatistics;
import com.propertymgmt.property.dto.PaymentRequest;
import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.model.FeeItem;
import com.propertymgmt.property.model.Payment;
import com.propertymgmt.property.model.Resident;
import com.propertymgmt.property.repository.FeeBillRepository;
import com.propertymgmt.property.repository.FeeItemRepository;
import com.propertymgmt.property.repository.PaymentRepository;
import com.propertymgmt.property.repository.ResidentRepository;
import com.propertymgmt.property.service.FeeService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FeeServiceImpl implements FeeService {

    private final FeeBillRepository feeBillRepository;
    private final PaymentRepository paymentRepository;
    private final FeeItemRepository feeItemRepository;
    private final ResidentRepository residentRepository;

    public FeeServiceImpl(FeeBillRepository feeBillRepository,
                         PaymentRepository paymentRepository,
                         FeeItemRepository feeItemRepository,
                         ResidentRepository residentRepository) {
        this.feeBillRepository = feeBillRepository;
        this.paymentRepository = paymentRepository;
        this.feeItemRepository = feeItemRepository;
        this.residentRepository = residentRepository;
    }

    // ========== 账单管理 ==========

    @Override
    public List<FeeBill> findAllBills() {
        return feeBillRepository.findAll();
    }

    @Override
    public FeeBill findBillById(Long id) {
        return feeBillRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("账单不存在"));
    }

    @Override
    @Transactional
    public FeeBill createBill(BillRequest request) {
        FeeBill bill = new FeeBill();
        bill.setBillNumber(generateBillNumber());
        bill.setOwnerName(request.getOwnerName());
        bill.setBuilding(request.getBuilding());
        bill.setType(request.getType());
        bill.setAmount(request.getAmount());
        bill.setBillingPeriod(request.getBillingPeriod());
        bill.setStatus(FeeBill.BillStatus.PENDING);
        return feeBillRepository.save(bill);
    }

    // ========== 缴费记录 ==========

    @Override
    public List<Payment> findAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    @Transactional
    public Payment createPayment(PaymentRequest request) {
        // 查找账单
        FeeBill bill = findBillById(request.getBillId());

        // 创建支付记录
        Payment payment = new Payment();
        payment.setOrderNumber(generateOrderNumber());
        payment.setBillId(bill.getId());
        payment.setOwnerName(bill.getOwnerName());
        payment.setBuilding(bill.getBuilding());
        payment.setAmount(bill.getAmount());
        payment.setType(bill.getType());
        payment.setPayMethod(request.getPayMethod());
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment = paymentRepository.save(payment);

        // 更新账单状态
        bill.setStatus(FeeBill.BillStatus.PAID);
        bill.setPaidAt(LocalDate.now());
        bill.setPayMethod(request.getPayMethod());
        feeBillRepository.save(bill);

        return payment;
    }

    // ========== 收费项目 ==========

    @Override
    public List<FeeItem> findAllFeeItems() {
        return feeItemRepository.findAll();
    }

    @Override
    public FeeItem findFeeItemById(Long id) {
        return feeItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("收费项目不存在"));
    }

    @Override
    @Transactional
    public FeeItem createFeeItem(FeeItemRequest request) {
        FeeItem item = new FeeItem();
        item.setName(request.getName());
        item.setUnit(request.getUnit());
        item.setPrice(request.getPrice());
        item.setDescription(request.getDescription());
        item.setStatus(FeeItem.ItemStatus.ACTIVE);
        return feeItemRepository.save(item);
    }

    @Override
    @Transactional
    public FeeItem updateFeeItem(Long id, FeeItemRequest request) {
        FeeItem item = findFeeItemById(id);
        item.setName(request.getName());
        item.setUnit(request.getUnit());
        item.setPrice(request.getPrice());
        item.setDescription(request.getDescription());
        return feeItemRepository.save(item);
    }

    @Override
    @Transactional
    public void deleteFeeItem(Long id) {
        feeItemRepository.deleteById(id);
    }

    @Override
    @Transactional
    public FeeItem toggleFeeItemStatus(Long id) {
        FeeItem item = findFeeItemById(id);
        if (item.getStatus() == FeeItem.ItemStatus.ACTIVE) {
            item.setStatus(FeeItem.ItemStatus.INACTIVE);
        } else {
            item.setStatus(FeeItem.ItemStatus.ACTIVE);
        }
        return feeItemRepository.save(item);
    }

    // ========== 批量生成账单 ==========

    @Override
    @Transactional
    public List<FeeBill> generateBillsFromFeeItem(Long feeItemId, String billingPeriod) {
        // 查找收费项目
        FeeItem feeItem = findFeeItemById(feeItemId);

        if (feeItem.getStatus() != FeeItem.ItemStatus.ACTIVE) {
            throw new RuntimeException("收费项目未启用，无法生成账单");
        }

        if (billingPeriod == null || billingPeriod.isBlank()) {
            throw new IllegalArgumentException("账期不能为空");
        }

        // 查找所有已入住的住户
        List<Resident> residents = residentRepository.findAll().stream()
            .filter(r -> r.getStatus() == Resident.Status.OCCUPIED)
            .toList();

        if (residents.isEmpty()) {
            throw new RuntimeException("没有已入住的住户");
        }

        // 为每个住户生成账单
        List<FeeBill> bills = new ArrayList<>();
        for (Resident resident : residents) {
            if (feeBillRepository.existsByTypeAndBillingPeriodAndOwnerName(
                feeItem.getName(), billingPeriod, resident.getName())) {
                continue;
            }

            FeeBill bill = new FeeBill();
            bill.setBillNumber(generateBillNumber());
            bill.setOwnerName(resident.getName());
            bill.setBuilding(resident.getBuilding() + " " + resident.getUnit() + " " + resident.getRoomNumber());
            bill.setType(feeItem.getName());
            bill.setBillingPeriod(billingPeriod);
            bill.setStatus(FeeBill.BillStatus.PENDING);

            // 计算金额
            BigDecimal amount = calculateAmount(feeItem, resident);
            bill.setAmount(amount);

            bills.add(feeBillRepository.save(bill));
        }

        if (bills.isEmpty()) {
            throw new RuntimeException("选定账期的账单已存在，无需重复生成");
        }

        return bills;
    }

    /**
     * 根据收费项目和住户信息计算金额
     */
    private BigDecimal calculateAmount(FeeItem feeItem, Resident resident) {
        BigDecimal price = feeItem.getPrice();
        String unit = feeItem.getUnit();

        // 如果单位包含 ㎡，则根据面积计算
        if (unit != null && unit.contains("㎡") && resident.getArea() != null && !resident.getArea().isEmpty()) {
            try {
                // 提取面积数字（去除单位）
                String areaStr = resident.getArea().replaceAll("[^0-9.]", "");
                BigDecimal area = new BigDecimal(areaStr);
                return price.multiply(area).setScale(2, RoundingMode.HALF_UP);
            } catch (NumberFormatException e) {
                // 如果解析失败，返回固定单价
                return price;
            }
        }

        // 其他情况返回固定单价
        return price;
    }

    // ========== 统计 ==========

    @Override
    public FeeStatistics getStatistics() {
        // 获取当前月份的开始和结束时间
        YearMonth currentYearMonth = YearMonth.now();
        LocalDateTime monthStart = currentYearMonth.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = currentYearMonth.atEndOfMonth().atTime(23, 59, 59);
        String currentMonth = currentYearMonth.format(DateTimeFormatter.ofPattern("yyyy年M月"));

        // 获取所有账单和缴费记录
        List<FeeBill> allBills = feeBillRepository.findAll();
        List<Payment> allPayments = paymentRepository.findAll();

        // 本月应收：从账单管理中查询本月账期的账单总金额（支持模糊匹配）
        BigDecimal monthlyReceivable = allBills.stream()
            .filter(bill -> {
                String period = bill.getBillingPeriod();
                // 支持多种格式：
                // "2025年10月" (标准格式)
                // "2025年10月15日" (带日期)
                // "2025年10月15" (带日期但无"日")
                return period != null && period.startsWith(currentMonth);
            })
            .map(FeeBill::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 本月实收：从缴费记录中查询本月缴费成功的总金额（按缴费时间统计）
        BigDecimal monthlyReceived = allPayments.stream()
            .filter(payment -> payment.getStatus() == Payment.PaymentStatus.SUCCESS)
            .filter(payment -> {
                LocalDateTime createdAt = payment.getCreatedAt();
                return createdAt != null &&
                       !createdAt.isBefore(monthStart) &&
                       !createdAt.isAfter(monthEnd);
            })
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 计算本月账期账单的已缴费金额（用于计算缴费率）
        BigDecimal monthlyBillsPaid = allBills.stream()
            .filter(bill -> {
                String period = bill.getBillingPeriod();
                return period != null && period.startsWith(currentMonth);
            })
            .filter(bill -> bill.getStatus() == FeeBill.BillStatus.PAID)
            .map(FeeBill::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 欠费总额：所有未支付的账单总金额
        BigDecimal totalArrears = allBills.stream()
            .filter(bill -> bill.getStatus() != FeeBill.BillStatus.PAID)
            .map(FeeBill::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 缴费率：本月账期账单的完成度（本月账期已缴费 / 本月账期应收 × 100%）
        Double paymentRate = 0.0;
        if (monthlyReceivable.compareTo(BigDecimal.ZERO) > 0) {
            paymentRate = monthlyBillsPaid
                .divide(monthlyReceivable, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .doubleValue();
        }

        return new FeeStatistics(monthlyReceivable, monthlyReceived, totalArrears, paymentRate);
    }

    // ========== 辅助方法 ==========

    private String generateBillNumber() {
        return "B" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
    }

    private String generateOrderNumber() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
            + String.format("%03d", (int) (Math.random() * 1000));
    }
}
