package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.model.FeeBill.BillStatus;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FeeBillRepository extends JpaRepository<FeeBill, Long> {

    long countByStatus(BillStatus status);

    @Query("select coalesce(sum(f.amount),0) from FeeBill f where f.status = 'PAID'")
    BigDecimal sumPaidAmount();
}
