package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.model.Announcement;
import com.propertymgmt.property.repository.AnnouncementRepository;
import com.propertymgmt.property.service.AnnouncementService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementServiceImpl(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Override
    public List<Announcement> findLatest() {
        return announcementRepository.findAll(PageRequest.of(0, 10)).getContent();
    }

    @Override
    @Transactional
    public Announcement create(Announcement announcement) {
        if (announcement.getPublishAt() == null) {
            announcement.setPublishAt(LocalDateTime.now());
        }
        return announcementRepository.save(announcement);
    }

    @Override
    @Transactional
    public Announcement update(Long id, Announcement announcement) {
        Announcement existing = announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("公告不存在: " + id));

        // 更新字段
        existing.setTitle(announcement.getTitle());
        existing.setContent(announcement.getContent());
        existing.setTargetScope(announcement.getTargetScope());

        return announcementRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Announcement existing = announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("公告不存在: " + id));

        announcementRepository.delete(existing);
    }
}
