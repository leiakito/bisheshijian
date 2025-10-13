package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.PropertyUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PropertyUnitRepository extends JpaRepository<PropertyUnit, Long> {

    long countByStatus(PropertyUnit.UnitStatus status);

    Page<PropertyUnit> findByStatus(PropertyUnit.UnitStatus status, Pageable pageable);

    @Query("""
        select p from PropertyUnit p
        where lower(p.building) like lower(concat('%', :keyword, '%'))
           or lower(p.unit) like lower(concat('%', :keyword, '%'))
           or lower(p.roomNumber) like lower(concat('%', :keyword, '%'))
           or lower(p.ownerName) like lower(concat('%', :keyword, '%'))
        """)
    Page<PropertyUnit> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        select p from PropertyUnit p
        where p.status = :status and (
              lower(p.building) like lower(concat('%', :keyword, '%'))
           or lower(p.unit) like lower(concat('%', :keyword, '%'))
           or lower(p.roomNumber) like lower(concat('%', :keyword, '%'))
           or lower(p.ownerName) like lower(concat('%', :keyword, '%'))
        )
        """)
    Page<PropertyUnit> findByKeywordAndStatus(@Param("keyword") String keyword,
                                              @Param("status") PropertyUnit.UnitStatus status,
                                              Pageable pageable);
}
