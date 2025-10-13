package com.propertymgmt.property.service;

import com.propertymgmt.property.model.Announcement;
import java.util.List;

public interface AnnouncementService {
    List<Announcement> findLatest();
    Announcement create(Announcement announcement);
    Announcement update(Long id, Announcement announcement);
    void delete(Long id);
}
