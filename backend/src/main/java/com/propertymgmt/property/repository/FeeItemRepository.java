package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.FeeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeItemRepository extends JpaRepository<FeeItem, Long> {
}
