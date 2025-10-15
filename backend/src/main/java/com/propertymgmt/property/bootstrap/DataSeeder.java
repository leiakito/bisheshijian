package com.propertymgmt.property.bootstrap;

import com.propertymgmt.property.model.Announcement;
import com.propertymgmt.property.model.Complaint;
import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.model.RepairOrder;
import com.propertymgmt.property.model.Resident;
import com.propertymgmt.property.model.Role;
import com.propertymgmt.property.model.User;
import com.propertymgmt.property.repository.AnnouncementRepository;
import com.propertymgmt.property.repository.ComplaintRepository;
import com.propertymgmt.property.repository.FeeBillRepository;
import com.propertymgmt.property.repository.RepairOrderRepository;
import com.propertymgmt.property.repository.ResidentRepository;
import com.propertymgmt.property.repository.RoleRepository;
import com.propertymgmt.property.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ResidentRepository residentRepository;
    private final FeeBillRepository feeBillRepository;
    private final ComplaintRepository complaintRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      ResidentRepository residentRepository,
                      FeeBillRepository feeBillRepository,
                      ComplaintRepository complaintRepository,
                      RepairOrderRepository repairOrderRepository,
                      AnnouncementRepository announcementRepository,
                      PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.residentRepository = residentRepository;
        this.feeBillRepository = feeBillRepository;
        this.complaintRepository = complaintRepository;
        this.repairOrderRepository = repairOrderRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedResidents();  // 先创建住户
        seedUsers();      // 再创建用户（需要关联住户）
        seedFeeBills();
        seedComplaints();
        seedRepairOrders();
        seedAnnouncements();
    }

    private void seedRoles() {
        if (roleRepository.count() > 0) {
            return;
        }

        // 注意：角色ID必须与SQL脚本中的ID一致
        // ADMIN: 1, USER: 2, ENGINEER: 3
        // 如果数据库是空的，请先运行 reset_roles.sql 脚本

        Role admin = new Role();
        admin.setCode("ADMIN");
        admin.setName("系统管理员");
        admin.setDescription("拥有系统所有权限");

        Role user = new Role();
        user.setCode("USER");
        user.setName("普通用户");
        user.setDescription("负责日常使用物业系统的业主");

        Role engineer = new Role();
        engineer.setCode("ENGINEER");
        engineer.setName("工程人员");
        engineer.setDescription("负责设施维护和报修处理");

        roleRepository.saveAll(List.of(admin, user, engineer));
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }
        Role adminRole = roleRepository.findByCode("ADMIN").orElseThrow();
        Role userRole = roleRepository.findByCode("USER").orElseThrow();
        Role engineerRole = roleRepository.findByCode("ENGINEER").orElseThrow();

        // 获取住户用于关联
        List<Resident> residents = residentRepository.findAll();
        Resident zhangsan = residents.stream().filter(r -> "张三".equals(r.getName())).findFirst().orElse(null);
        Resident lisi = residents.stream().filter(r -> "李四".equals(r.getName())).findFirst().orElse(null);

        // 管理员用户（不关联住户）
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setFullName("系统管理员");
        admin.setPhone("13800000001");
        admin.setEmail("admin@property.com");
        admin.getRoles().add(adminRole);

        // 普通用户（关联住户张三）
        User owner = new User();
        owner.setUsername("owner");
        owner.setPassword(passwordEncoder.encode("123456"));
        owner.setFullName("业主张三");
        owner.setPhone("13800000002");
        owner.setEmail("owner@property.com");
        owner.setResident(zhangsan);  // 关联住户
        owner.getRoles().add(userRole);

        // 工程人员（关联住户李四）
        User engineer = new User();
        engineer.setUsername("engineer");
        engineer.setPassword(passwordEncoder.encode("123456"));
        engineer.setFullName("工程小王");
        engineer.setPhone("13800000004");
        engineer.setEmail("engineer@property.com");
        engineer.setResident(lisi);  // 关联住户
        engineer.getRoles().add(engineerRole);

        userRepository.saveAll(List.of(admin, owner, engineer));
    }

    private void seedResidents() {
        if (residentRepository.count() > 0) {
            return;
        }
        residentRepository.saveAll(List.of(
            createResident("张三", "13823451234", "1号楼", "2单元", "301", "120㎡", Resident.Status.OCCUPIED, LocalDate.of(2023, 1, 15)),
            createResident("李四", "13944315678", "1号楼", "2单元", "302", "95㎡", Resident.Status.OCCUPIED, LocalDate.of(2023, 3, 20)),
            createResident("王五", "13629639012", "2号楼", "1单元", "501", "150㎡", Resident.Status.OCCUPIED, LocalDate.of(2022, 12, 1)),
            createResident("赵六", "13787764346", "3号楼", "3单元", "201", "88㎡", Resident.Status.VACANT, null)
        ));
    }

    private Resident createResident(String name, String phone, String building, String unit, String room,
                                    String area, Resident.Status status, LocalDate moveIn) {
        Resident resident = new Resident();
        resident.setName(name);
        resident.setPhone(phone);
        resident.setBuilding(building);
        resident.setUnit(unit);
        resident.setRoomNumber(room);
        resident.setArea(area);
        resident.setStatus(status);
        resident.setMoveInDate(moveIn);
        return resident;
    }

    private void seedFeeBills() {
        if (feeBillRepository.count() > 0) {
            return;
        }
        feeBillRepository.saveAll(List.of(
            createFeeBill("BILL-202501-001", "张三", "1号楼2单元301", "物业费", new BigDecimal("2400"), "2025年1月", FeeBill.BillStatus.PAID, LocalDate.of(2025, 1, 5), "微信支付"),
            createFeeBill("BILL-202501-002", "李四", "1号楼2单元302", "物业费", new BigDecimal("1900"), "2025年1月", FeeBill.BillStatus.PENDING, null, null),
            createFeeBill("BILL-202501-003", "王五", "2号楼1单元501", "物业费+停车费", new BigDecimal("3200"), "2025年1月", FeeBill.BillStatus.PAID, LocalDate.of(2025, 1, 3), "支付宝"),
            createFeeBill("BILL-202501-004", "赵六", "3号楼3单元201", "物业费", new BigDecimal("1760"), "2025年1月", FeeBill.BillStatus.OVERDUE, null, null)
        ));
    }

    private FeeBill createFeeBill(String number, String owner, String building, String type, BigDecimal amount,
                                  String period, FeeBill.BillStatus status, LocalDate paidAt, String method) {
        FeeBill bill = new FeeBill();
        bill.setBillNumber(number);
        bill.setOwnerName(owner);
        bill.setBuilding(building);
        bill.setType(type);
        bill.setAmount(amount);
        bill.setBillingPeriod(period);
        bill.setStatus(status);
        bill.setPaidAt(paidAt);
        bill.setPayMethod(method);
        return bill;
    }

    private void seedComplaints() {
        if (complaintRepository.count() > 0) {
            return;
        }
        Complaint processing = new Complaint();
        processing.setOwnerName("张三");
        processing.setPhone("138****1234");
        processing.setType("噪音问题");
        processing.setDescription("楼上装修持续到深夜，希望协调");
        processing.setStatus(Complaint.ComplaintStatus.PROCESSING);
        processing.setProcessedBy("客服小李");
        processing.setFeedbackDeadline(LocalDateTime.now().plusHours(12));

        Complaint completed = new Complaint();
        completed.setOwnerName("李四");
        completed.setPhone("139****5678");
        completed.setType("环境卫生");
        completed.setDescription("电梯卫生需要加强清洁");
        completed.setStatus(Complaint.ComplaintStatus.COMPLETED);
        completed.setProcessedBy("客服小李");
        completed.setReply("已安排保洁重新清扫");
        completed.setFeedbackDeadline(LocalDateTime.now().plusHours(12));

        complaintRepository.saveAll(List.of(processing, completed));
    }

    private void seedRepairOrders() {
        if (repairOrderRepository.count() > 0) {
            return;
        }
        RepairOrder pending = new RepairOrder();
        pending.setOrderNumber("R20250105001");
        pending.setOwnerName("张三");
        pending.setPhone("138****1234");
        pending.setType("水管漏水");
        pending.setDescription("厨房水管接口处漏水，水流较大，需要紧急处理");
        pending.setBuilding("1号楼");
        pending.setUnit("2单元");
        pending.setRoomNumber("301");
        pending.setPriority(RepairOrder.Priority.URGENT);
        pending.setStatus(RepairOrder.RepairStatus.PENDING);

        RepairOrder processing = new RepairOrder();
        processing.setOrderNumber("R20250105002");
        processing.setOwnerName("李四");
        processing.setPhone("139****5678");
        processing.setType("电梯故障");
        processing.setDescription("电梯按键失灵，2楼和3楼按钮无反应");
        processing.setBuilding("1号楼");
        processing.setUnit("2单元");
        processing.setRoomNumber("302");
        processing.setPriority(RepairOrder.Priority.URGENT);
        processing.setStatus(RepairOrder.RepairStatus.IN_PROGRESS);
        processing.setAssignedWorker("王师傅");
        processing.setStartedAt(LocalDateTime.now().minusHours(2));

        RepairOrder completed = new RepairOrder();
        completed.setOrderNumber("R20250104001");
        completed.setOwnerName("王五");
        completed.setPhone("136****9012");
        completed.setType("门禁损坏");
        completed.setDescription("单元门禁刷卡无反应，可能是读卡器故障");
        completed.setBuilding("2号楼");
        completed.setUnit("1单元");
        completed.setRoomNumber("501");
        completed.setPriority(RepairOrder.Priority.NORMAL);
        completed.setStatus(RepairOrder.RepairStatus.COMPLETED);
        completed.setAssignedWorker("王师傅");
        completed.setStartedAt(LocalDateTime.now().minusDays(1));
        completed.setFinishedAt(LocalDateTime.now().minusHours(16));
        completed.setEvaluationScore(5);
        completed.setEvaluationRemark("维修很及时，师傅很专业！");

        repairOrderRepository.saveAll(List.of(pending, processing, completed));
    }

    private void seedAnnouncements() {
        if (announcementRepository.count() > 0) {
            return;
        }
        Announcement general = new Announcement();
        general.setTitle("春节期间物业服务安排");
        general.setContent("春节期间保安、保洁全天值班，紧急服务请拨打客服电话。");
        general.setTargetScope("全小区");
        general.setPublishAt(LocalDateTime.now().minusDays(2));

        Announcement maintenance = new Announcement();
        maintenance.setTitle("2号楼电梯维保通知");
        maintenance.setContent("2号楼电梯将于1月15日进行维保，期间请使用旁边楼梯出入。");
        maintenance.setTargetScope("2号楼");
        maintenance.setPublishAt(LocalDateTime.now().minusDays(1));

        announcementRepository.saveAll(List.of(general, maintenance));
    }
}
