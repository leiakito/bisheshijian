package com.propertymgmt.property.controller;

import com.propertymgmt.property.dto.ApiResponse;
import com.propertymgmt.property.model.Announcement;
import com.propertymgmt.property.service.AnnouncementService;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/announcements")

public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Announcement>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(announcementService.findLatest()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> create(@Valid @RequestBody Announcement announcement) {
        System.out.println("=== 接收到公告创建请求 ===");
        System.out.println("标题: " + announcement.getTitle());
        System.out.println("内容: " + announcement.getContent());
        System.out.println("目标范围: " + announcement.getTargetScope());
        System.out.println("发布时间: " + announcement.getPublishAt());

        Announcement created = announcementService.create(announcement);

        System.out.println("=== 保存后的公告 ===");
        System.out.println("ID: " + created.getId());
        System.out.println("标题: " + created.getTitle());
        System.out.println("内容: " + created.getContent());
        System.out.println("目标范围: " + created.getTargetScope());
        System.out.println("发布时间: " + created.getPublishAt());

        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> update(
            @PathVariable Long id,
            @Valid @RequestBody Announcement announcement) {
        System.out.println("=== 接收到公告更新请求 ===");
        System.out.println("公告ID: " + id);
        System.out.println("标题: " + announcement.getTitle());
        System.out.println("内容: " + announcement.getContent());
        System.out.println("目标范围: " + announcement.getTargetScope());

        Announcement updated = announcementService.update(id, announcement);

        System.out.println("=== 更新后的公告 ===");
        System.out.println("ID: " + updated.getId());
        System.out.println("标题: " + updated.getTitle());
        System.out.println("内容: " + updated.getContent());
        System.out.println("目标范围: " + updated.getTargetScope());
        System.out.println("发布时间: " + updated.getPublishAt());

        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        System.out.println("=== 接收到公告删除请求 ===");
        System.out.println("公告ID: " + id);

        announcementService.delete(id);

        System.out.println("=== 公告删除成功 ===");

        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
