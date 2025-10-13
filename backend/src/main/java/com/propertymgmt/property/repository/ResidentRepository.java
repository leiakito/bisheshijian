package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.Resident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResidentRepository extends JpaRepository<Resident, Long> {

    @Query("""
        select r from Resident r
        where lower(r.name) like lower(concat('%', :keyword, '%'))
           or lower(r.phone) like lower(concat('%', :keyword, '%'))
           or lower(r.building) like lower(concat('%', :keyword, '%'))
           or lower(r.roomNumber) like lower(concat('%', :keyword, '%'))
        """)
    Page<Resident> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Page<Resident> findByStatus(Resident.Status status, Pageable pageable);

    @Query("""
        select r from Resident r
        where r.status = :status and (
              lower(r.name) like lower(concat('%', :keyword, '%'))
           or lower(r.phone) like lower(concat('%', :keyword, '%'))
           or lower(r.building) like lower(concat('%', :keyword, '%'))
           or lower(r.roomNumber) like lower(concat('%', :keyword, '%'))
        )
        """)
    Page<Resident> searchByKeywordAndStatus(@Param("keyword") String keyword,
                                            @Param("status") Resident.Status status,
                                            Pageable pageable);
}
