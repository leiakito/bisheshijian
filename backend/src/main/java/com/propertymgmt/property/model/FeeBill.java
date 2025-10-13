package com.propertymgmt.property.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fee_bills")
public class FeeBill extends BaseEntity {

    public enum BillStatus {
        PAID,
        PENDING,
        OVERDUE
    }

    @Column(name = "bill_number", nullable = false, unique = true, length = 30)
    private String billNumber;

    @Column(name = "owner_name", nullable = false, length = 50)
    private String ownerName;

    @Column(nullable = false, length = 100)
    private String building;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "billing_period", nullable = false, length = 20)
    private String billingPeriod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BillStatus status = BillStatus.PENDING;

    @Column(name = "paid_at")
    private LocalDate paidAt;

    @Column(name = "pay_method", length = 30)
    private String payMethod;

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getBillingPeriod() {
        return billingPeriod;
    }

    public void setBillingPeriod(String billingPeriod) {
        this.billingPeriod = billingPeriod;
    }

    public BillStatus getStatus() {
        return status;
    }

    public void setStatus(BillStatus status) {
        this.status = status;
    }

    public LocalDate getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDate paidAt) {
        this.paidAt = paidAt;
    }

    public String getPayMethod() {
        return payMethod;
    }

    public void setPayMethod(String payMethod) {
        this.payMethod = payMethod;
    }
}
