package com.propertymgmt.property.dto;

import java.math.BigDecimal;

public class FeeStatistics {

    private BigDecimal monthlyReceivable; // 本月应收
    private BigDecimal monthlyReceived;   // 本月实收
    private BigDecimal totalArrears;      // 欠费总额
    private Double paymentRate;           // 缴费率

    public FeeStatistics() {
    }

    public FeeStatistics(BigDecimal monthlyReceivable, BigDecimal monthlyReceived,
                        BigDecimal totalArrears, Double paymentRate) {
        this.monthlyReceivable = monthlyReceivable;
        this.monthlyReceived = monthlyReceived;
        this.totalArrears = totalArrears;
        this.paymentRate = paymentRate;
    }

    public BigDecimal getMonthlyReceivable() {
        return monthlyReceivable;
    }

    public void setMonthlyReceivable(BigDecimal monthlyReceivable) {
        this.monthlyReceivable = monthlyReceivable;
    }

    public BigDecimal getMonthlyReceived() {
        return monthlyReceived;
    }

    public void setMonthlyReceived(BigDecimal monthlyReceived) {
        this.monthlyReceived = monthlyReceived;
    }

    public BigDecimal getTotalArrears() {
        return totalArrears;
    }

    public void setTotalArrears(BigDecimal totalArrears) {
        this.totalArrears = totalArrears;
    }

    public Double getPaymentRate() {
        return paymentRate;
    }

    public void setPaymentRate(Double paymentRate) {
        this.paymentRate = paymentRate;
    }
}
