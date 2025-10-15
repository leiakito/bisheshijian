package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.dto.ComplaintRequest;
import com.propertymgmt.property.dto.ComplaintUpdateRequest;
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
    @Transactional(readOnly = true)
    public Complaint findById(Long id) {
        return complaintRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("投诉记录不存在"));
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

    @Override
    public Complaint updateStatus(Long id, ComplaintUpdateRequest request) {
        Complaint complaint = findById(id);

        // 更新状态
        complaint.setStatus(Complaint.ComplaintStatus.valueOf(request.getStatus()));

        // 更新处理人
        if (request.getProcessedBy() != null) {
            complaint.setProcessedBy(request.getProcessedBy());
        }

        // 更新回复
        if (request.getReply() != null) {
            complaint.setReply(request.getReply());
        }

        return complaintRepository.save(complaint);
    }
}
