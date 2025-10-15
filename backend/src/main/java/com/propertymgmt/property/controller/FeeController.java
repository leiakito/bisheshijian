package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.dto.BillRequest;
import com.propertymgmt.property.dto.FeeItemRequest;
import com.propertymgmt.property.dto.FeeStatistics;
import com.propertymgmt.property.dto.GenerateBillsRequest;
import com.propertymgmt.property.dto.PaymentRequest;
import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.model.FeeItem;
import com.propertymgmt.property.model.Payment;
import com.propertymgmt.property.service.FeeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    // ========== 账单管理 ==========

    @GetMapping("/bills")
    public ResponseEntity<ApiResponse<List<FeeBill>>> getAllBills(
            @RequestParam(required = false) String ownerName) {
        if (ownerName != null && !ownerName.isEmpty()) {
            // 如果提供了业主姓名，筛选该业主的账单
            List<FeeBill> allBills = feeService.findAllBills();
            List<FeeBill> filtered = allBills.stream()
                .filter(bill -> ownerName.equals(bill.getOwnerName()))
                .toList();
            return ResponseEntity.ok(ApiResponse.ok(filtered));
        }
        return ResponseEntity.ok(ApiResponse.ok(feeService.findAllBills()));
    }

    @GetMapping("/bills/{id}")
    public ResponseEntity<ApiResponse<FeeBill>> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.findBillById(id)));
    }

    @PostMapping("/bills")
    public ResponseEntity<ApiResponse<FeeBill>> createBill(@Valid @RequestBody BillRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.createBill(request)));
    }

    // ========== 缴费记录 ==========

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.ok(feeService.findAllPayments()));
    }

    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<Payment>> createPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.createPayment(request)));
    }

    // ========== 收费项目 ==========

    @GetMapping("/items")
    public ResponseEntity<ApiResponse<List<FeeItem>>> getAllFeeItems() {
        return ResponseEntity.ok(ApiResponse.ok(feeService.findAllFeeItems()));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<ApiResponse<FeeItem>> getFeeItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.findFeeItemById(id)));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<FeeItem>> createFeeItem(@Valid @RequestBody FeeItemRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.createFeeItem(request)));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse<FeeItem>> updateFeeItem(@PathVariable Long id,
                                                               @Valid @RequestBody FeeItemRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.updateFeeItem(id, request)));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeeItem(@PathVariable Long id) {
        feeService.deleteFeeItem(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PutMapping("/items/{id}/toggle-status")
    public ResponseEntity<ApiResponse<FeeItem>> toggleFeeItemStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(feeService.toggleFeeItemStatus(id)));
    }

    @PostMapping("/items/{id}/generate-bills")
    public ResponseEntity<ApiResponse<List<FeeBill>>> generateBillsFromFeeItem(
            @PathVariable Long id,
            @Valid @RequestBody GenerateBillsRequest request) {
        List<FeeBill> bills = feeService.generateBillsFromFeeItem(id, request.getBillingPeriod());
        return ResponseEntity.ok(ApiResponse.ok(bills));
    }

    // ========== 统计 ==========

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<FeeStatistics>> getStatistics() {
        return ResponseEntity.ok(ApiResponse.ok(feeService.getStatistics()));
    }
}
