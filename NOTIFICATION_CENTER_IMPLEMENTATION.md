# 通知中心功能实现说明

## 功能概述
通知中心从后端数据库获取真实数据，整合公告(announcements)和投诉(complaints)信息，为管理员提供统一的通知管理界面。

## 数据来源

### 1. 公告通知
- **数据表**: `announcements`
- **API接口**: `GET /api/announcements`
- **显示规则**: 显示所有最新公告
- **通知标题**: "新公告：{公告标题}"
- **通知内容**: 公告的完整内容

### 2. 投诉处理通知
- **数据表**: `complaints`
- **API接口**: `GET /api/complaints`
- **显示规则**: 仅显示状态为 `COMPLETED` (已完成) 的投诉
- **通知标题**: "投诉已处理完成"
- **通知内容**: 包含投诉类型、处理人、回复内容

## 技术实现

### 文件结构

```
前端:
├── /front/src/types/api.ts
│   └── 添加 Notification 类型定义
│   └── 更新 Complaint 类型以匹配后端
├── /front/src/services/notificationService.ts (新建)
│   └── 通知数据获取和转换逻辑
├── /front/src/services/complaintService.ts
│   └── 更新为获取所有投诉列表
└── /front/src/components/NotificationCenter.tsx
    └── 通知中心主组件

后端:
├── /backend/.../model/Complaint.java
│   └── 投诉数据模型
├── /backend/.../model/Announcement.java
│   └── 公告数据模型
├── /backend/.../controller/ComplaintController.java
│   └── 投诉API接口
└── /backend/.../controller/AnnouncementController.java
    └── 公告API接口
```

### 核心代码

#### 1. 通知服务 (notificationService.ts)

**功能**:
- 并行获取公告和投诉数据
- 将后端数据转换为统一的通知格式
- 过滤投诉（仅显示已完成的）
- 格式化时间显示

**关键方法**:
```typescript
// 获取所有通知
export async function getAllNotifications(): Promise<Notification[]>

// 格式化时间差（刚刚、X分钟前、X小时前、X天前）
function formatTimeAgo(dateString?: string): string

// 公告转通知
function announcementToNotification(announcement: Announcement): Notification

// 投诉转通知
function complaintToNotification(complaint: Complaint): Notification
```

#### 2. 通知中心组件 (NotificationCenter.tsx)

**功能**:
- 加载并显示所有通知
- 统计未读/已读通知数量
- 标记已读/全部已读
- 删除通知
- 按类型筛选通知（全部/未读/公告/投诉）

**状态管理**:
```typescript
const [notifications, setNotifications] = useState<Notification[]>([])
const [loading, setLoading] = useState(true)
```

## 数据流程

### 1. 数据获取流程
```
用户访问通知中心
    ↓
NotificationCenter.tsx (useEffect)
    ↓
notificationService.getAllNotifications()
    ↓
并行调用:
    ├─→ getLatestAnnouncements() → AnnouncementController → announcements表
    └─→ getAllComplaints() → ComplaintController → complaints表
    ↓
数据转换和合并
    ↓
显示在界面上
```

### 2. 数据转换逻辑

#### 公告 → 通知
```typescript
{
  id: `announcement-${announcement.id}`,
  type: 'announcement',
  title: `新公告：${announcement.title}`,
  content: announcement.content,
  time: formatTimeAgo(announcement.publishAt),
  read: false,
  icon: Bell,
  color: "text-blue-600",
  bg: "bg-blue-100",
  sourceId: announcement.id
}
```

#### 投诉 → 通知 (仅 COMPLETED 状态)
```typescript
{
  id: `complaint-${complaint.id}`,
  type: 'complaint',
  title: `投诉已处理完成`,
  content: `您的投诉"${complaint.type}"已处理完成...`,
  time: formatTimeAgo(complaint.updatedAt),
  read: false,
  icon: CheckCircle,
  color: "text-green-600",
  bg: "bg-green-100",
  sourceId: complaint.id
}
```

## 界面功能

### 1. 顶部统计卡片
- **全部通知**: 显示通知总数
- **未读通知**: 显示未读通知数量
- **已读通知**: 显示已读通知数量

### 2. 操作按钮
- **全部已读**: 将所有通知标记为已读
- **标记已读**: 将单个通知标记为已读
- **删除**: 删除单个通知（仅前端状态，不影响数据库）

### 3. 标签页筛选
- **全部**: 显示所有通知
- **未读**: 仅显示未读通知
- **公告通知**: 仅显示公告类型的通知
- **投诉处理**: 仅显示投诉处理完成的通知

### 4. 通知项显示
- 图标（根据类型显示不同颜色）
- 标题
- 内容
- 时间（相对时间，如"10分钟前"）
- "新"徽章（未读通知）
- 操作按钮（标记已读、删除）

## 时间格式化规则

```typescript
刚刚            - 少于1分钟
X分钟前         - 1-59分钟
X小时前         - 1-23小时
X天前           - 1-29天
YYYY/MM/DD      - 30天以上
```

## 数据库表结构

### announcements 表
```sql
- id (主键)
- title (标题)
- content (内容)
- target_scope (目标范围)
- publish_at (发布时间)
- created_at (创建时间)
- updated_at (更新时间)
```

### complaints 表
```sql
- id (主键)
- owner_name (业主姓名)
- phone (电话)
- type (投诉类型)
- description (描述)
- status (状态: RECEIVED/PROCESSING/COMPLETED/CLOSED)
- processed_by (处理人)
- reply (回复)
- feedback_deadline (反馈截止时间)
- created_at (创建时间)
- updated_at (更新时间)
```

## 注意事项

### 1. 不修改数据库表
✅ **遵守原则**: 所有功能实现均不修改现有数据库表结构
- 使用现有的 `announcements` 表字段
- 使用现有的 `complaints` 表字段
- 不添加新的通知表

### 2. 前端状态管理
⚠️ **重要**:
- `read` 状态仅保存在前端内存中
- 刷新页面后，所有通知将重新显示为未读
- 删除操作仅影响前端显示，不影响数据库

### 3. 性能考虑
- 使用 `Promise.all` 并行获取数据
- 仅在组件挂载时加载一次数据
- 后续操作（标记已读、删除）仅更新前端状态

### 4. 扩展建议

如需持久化通知状态，可考虑：
1. 创建 `notification_read_status` 表记录用户已读状态
2. 添加 `user_id` 和 `notification_id` 关联
3. 实现标记已读的后端API

## API接口说明

### 1. 获取公告列表
```
GET /api/announcements
Response: List<Announcement>
```

### 2. 获取投诉列表
```
GET /api/complaints
Response: List<Complaint>
```

## 测试用例

### 测试场景1: 查看所有通知
1. 访问 `http://localhost:3000/admin/notifications`
2. ✅ 预期: 显示所有公告和已完成的投诉
3. ✅ 预期: 顶部显示正确的统计数字

### 测试场景2: 筛选未读通知
1. 点击"未读"标签
2. ✅ 预期: 仅显示未读通知
3. ✅ 预期: 空状态提示"没有未读通知"（如果无未读）

### 测试场景3: 标记已读
1. 点击某个通知的"标记已读"按钮
2. ✅ 预期: 该通知背景变为白色，"新"徽章消失
3. ✅ 预期: 未读数量减1，已读数量加1

### 测试场景4: 全部已读
1. 点击"全部已读"按钮
2. ✅ 预期: 所有通知标记为已读
3. ✅ 预期: 未读数量变为0

### 测试场景5: 删除通知
1. 点击某个通知的删除按钮
2. ✅ 预期: 该通知从列表中移除
3. ✅ 预期: 总数减1

### 测试场景6: 按类型筛选
1. 点击"公告通知"标签
2. ✅ 预期: 仅显示公告类型的通知
3. 点击"投诉处理"标签
4. ✅ 预期: 仅显示投诉处理完成的通知

## 故障排查

### 问题1: 通知列表为空
**可能原因**:
- 数据库中没有公告数据
- 数据库中没有状态为 COMPLETED 的投诉

**解决方法**:
```sql
-- 检查公告数据
SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10;

-- 检查已完成的投诉
SELECT * FROM complaints WHERE status = 'COMPLETED';
```

### 问题2: 时间显示不正确
**可能原因**:
- `publishAt` 或 `updatedAt` 字段为空
- 时间格式不正确

**解决方法**:
- 确保数据库中时间字段有值
- 检查 `formatTimeAgo` 函数的时间解析逻辑

### 问题3: API调用失败
**症状**: 控制台显示"加载通知失败"

**检查步骤**:
1. 确认后端服务是否运行
2. 检查浏览器控制台的网络请求
3. 确认API路径是否正确
4. 检查后端日志

## 相关文件清单

### 前端文件
- `/front/src/components/NotificationCenter.tsx` - 主组件
- `/front/src/services/notificationService.ts` - 通知服务
- `/front/src/services/complaintService.ts` - 投诉服务
- `/front/src/services/announcementService.ts` - 公告服务
- `/front/src/types/api.ts` - 类型定义

### 后端文件
- `/backend/.../controller/ComplaintController.java`
- `/backend/.../controller/AnnouncementController.java`
- `/backend/.../model/Complaint.java`
- `/backend/.../model/Announcement.java`
- `/backend/.../service/ComplaintService.java`
- `/backend/.../service/AnnouncementService.java`

## 更新日期
2025-01-15
