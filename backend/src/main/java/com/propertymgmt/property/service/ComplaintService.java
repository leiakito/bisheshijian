package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.ComplaintRequest;
import com.propertymgmt.property.dto.ComplaintUpdateRequest;
import com.propertymgmt.property.model.Complaint;
import java.util.List;

public interface ComplaintService {
    List<Complaint> findAll();
    Complaint findById(Long id);
    Complaint create(ComplaintRequest request);
    Complaint updateStatus(Long id, ComplaintUpdateRequest request);
}
