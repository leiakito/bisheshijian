package com.propertymgmt.property.dto;

import java.math.BigDecimal;

public class DashboardSummary {
    private final long totalResidents;
    private final long pendingRepairs;
    private final long pendingComplaints;
    private final BigDecimal monthlyIncome;
    private final double occupancyRate;
    private final double paymentRate;

    private DashboardSummary(Builder builder) {
        this.totalResidents = builder.totalResidents;
        this.pendingRepairs = builder.pendingRepairs;
        this.pendingComplaints = builder.pendingComplaints;
        this.monthlyIncome = builder.monthlyIncome;
        this.occupancyRate = builder.occupancyRate;
        this.paymentRate = builder.paymentRate;
    }

    public static Builder builder() {
        return new Builder();
    }

    public long getTotalResidents() {
        return totalResidents;
    }

    public long getPendingRepairs() {
        return pendingRepairs;
    }

    public long getPendingComplaints() {
        return pendingComplaints;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }

    public double getPaymentRate() {
        return paymentRate;
    }

    public static class Builder {
        private long totalResidents;
        private long pendingRepairs;
        private long pendingComplaints;
        private BigDecimal monthlyIncome;
        private double occupancyRate;
        private double paymentRate;

        public Builder totalResidents(long totalResidents) {
            this.totalResidents = totalResidents;
            return this;
        }

        public Builder pendingRepairs(long pendingRepairs) {
            this.pendingRepairs = pendingRepairs;
            return this;
        }

        public Builder pendingComplaints(long pendingComplaints) {
            this.pendingComplaints = pendingComplaints;
            return this;
        }

        public Builder monthlyIncome(BigDecimal monthlyIncome) {
            this.monthlyIncome = monthlyIncome;
            return this;
        }

        public Builder occupancyRate(double occupancyRate) {
            this.occupancyRate = occupancyRate;
            return this;
        }

        public Builder paymentRate(double paymentRate) {
            this.paymentRate = paymentRate;
            return this;
        }

        public DashboardSummary build() {
            return new DashboardSummary(this);
        }
    }
}
