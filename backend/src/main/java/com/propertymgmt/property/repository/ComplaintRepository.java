package com.propertymgmt.property.repository;

import com.propertymgmt.property.model.Complaint;
import com.propertymgmt.property.model.Complaint.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    long countByStatus(ComplaintStatus status);
}
