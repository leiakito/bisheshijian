package com.propertymgmt.property.config;

import com.propertymgmt.property.model.Role;
import com.propertymgmt.property.model.User;
import com.propertymgmt.property.repository.RoleRepository;
import com.propertymgmt.property.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("=== 开始初始化数据 ===");

        // 初始化角色（注意：code不需要ROLE_前缀，UserPrincipal会自动添加）
        Role adminRole = initializeRole("ADMIN", "管理员", "系统管理员角色");
        Role userRole = initializeRole("USER", "普通用户", "普通用户角色");

        // 初始化管理员用户
        initializeAdminUser(adminRole);

        log.info("=== 数据初始化完成 ===");
    }

    private Role initializeRole(String code, String name, String description) {
        return roleRepository.findByCode(code)
            .orElseGet(() -> {
                Role role = new Role();
                role.setCode(code);
                role.setName(name);
                role.setDescription(description);
                Role savedRole = roleRepository.save(role);
                log.info("创建角色: {} - {}", code, name);
                return savedRole;
            });
    }

    private void initializeAdminUser(Role adminRole) {
        String adminUsername = "admin";
        String defaultPassword = "admin123";

        var existingAdmin = userRepository.findByUsername(adminUsername);
        if (existingAdmin.isEmpty()) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode(defaultPassword));
            admin.setFullName("系统管理员");
            admin.setEmail("admin@example.com");
            admin.setActive(true);
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            log.info("创建管理员用户: {} (密码: {})", adminUsername, defaultPassword);
        } else {
            User admin = existingAdmin.get();
            // 确保admin用户是激活状态并且有正确的角色
            if (!admin.getActive()) {
                admin.setActive(true);
                log.info("激活管理员用户: {}", adminUsername);
            }

            // 确保有ADMIN角色
            boolean hasAdminRole = admin.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getCode()));
            if (!hasAdminRole) {
                admin.getRoles().add(adminRole);
                log.info("为管理员用户添加ADMIN角色");
            }

            // 重置密码为默认密码（可选，仅在开发环境使用）
            admin.setPassword(passwordEncoder.encode(defaultPassword));
            userRepository.save(admin);
            log.info("管理员用户已存在: {} (密码已重置为: {})", adminUsername, defaultPassword);
        }
    }
}
