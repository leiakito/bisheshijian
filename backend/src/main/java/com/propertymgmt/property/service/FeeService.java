package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.BillRequest;
import com.propertymgmt.property.dto.FeeItemRequest;
import com.propertymgmt.property.dto.FeeStatistics;
import com.propertymgmt.property.dto.PaymentRequest;
import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.model.FeeItem;
import com.propertymgmt.property.model.Payment;
import java.util.List;

public interface FeeService {
    // 账单管理
    List<FeeBill> findAllBills();
    FeeBill findBillById(Long id);
    FeeBill createBill(BillRequest request);

    // 缴费记录
    List<Payment> findAllPayments();
    Payment createPayment(PaymentRequest request);

    // 收费项目
    List<FeeItem> findAllFeeItems();
    FeeItem findFeeItemById(Long id);
    FeeItem createFeeItem(FeeItemRequest request);
    FeeItem updateFeeItem(Long id, FeeItemRequest request);
    void deleteFeeItem(Long id);
    FeeItem toggleFeeItemStatus(Long id);

    // 批量生成账单
    List<FeeBill> generateBillsFromFeeItem(Long feeItemId, String billingPeriod);

    // 统计
    FeeStatistics getStatistics();
}
