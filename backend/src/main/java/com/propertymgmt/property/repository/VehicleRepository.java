package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Page<Vehicle> findByType(String type, Pageable pageable);

    @Query("""
        select v from Vehicle v
        where lower(v.ownerName) like lower(concat('%', :keyword, '%'))
           or lower(v.building) like lower(concat('%', :keyword, '%'))
           or lower(v.plateNumber) like lower(concat('%', :keyword, '%'))
           or lower(v.brand) like lower(concat('%', :keyword, '%'))
        """)
    Page<Vehicle> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        select v from Vehicle v
        where lower(v.type) = lower(:type) and (
              lower(v.ownerName) like lower(concat('%', :keyword, '%'))
           or lower(v.building) like lower(concat('%', :keyword, '%'))
           or lower(v.plateNumber) like lower(concat('%', :keyword, '%'))
           or lower(v.brand) like lower(concat('%', :keyword, '%'))
        )
        """)
    Page<Vehicle> findByKeywordAndType(@Param("keyword") String keyword,
                                       @Param("type") String type,
                                       Pageable pageable);
}
