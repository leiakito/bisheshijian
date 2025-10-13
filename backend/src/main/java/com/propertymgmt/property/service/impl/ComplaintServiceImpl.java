package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.ComplaintRequest;
import com.propertymgmt.property.model.Complaint;
import com.propertymgmt.property.repository.ComplaintRepository;
import com.propertymgmt.property.service.ComplaintService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Complaint> findAll() {
        return complaintRepository.findAll();
    }

    @Override
    public Complaint create(ComplaintRequest request) {
        Complaint complaint = new Complaint();
        complaint.setOwnerName(request.getOwnerName());
        complaint.setPhone(request.getPhone());
        complaint.setType(request.getType());
        complaint.setDescription(request.getDescription());
        complaint.setStatus(Complaint.ComplaintStatus.RECEIVED);
        complaint.setFeedbackDeadline(LocalDateTime.now().plusDays(1));
        return complaintRepository.save(complaint);
    }
}
