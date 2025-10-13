package com.propertymgmt.property.service;

import com.propertymgmt.property.dto.ComplaintRequest;
import com.propertymgmt.property.model.Complaint;
import java.util.List;

public interface ComplaintService {
    List<Complaint> findAll();
    Complaint create(ComplaintRequest request);
}
