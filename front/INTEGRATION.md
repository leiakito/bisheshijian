# 前后端集成说明

## 已完成的集成工作

### 1. API 服务层

创建了完整的 API 服务层，包括：

- **类型定义** (`src/types/api.ts`)
  - 所有 API 请求和响应的 TypeScript 类型定义
  - 包括登录、仪表盘、住户管理、报修、投诉等模块的类型

- **API 客户端** (`src/utils/apiClient.ts`)
  - 统一的 HTTP 请求封装
  - JWT Token 自动管理（存储、附加到请求头、过期处理）
  - 错误处理和重定向
  - 支持查询参数构建

- **服务模块** (`src/services/`)
  - `authService.ts` - 认证服务（登录、登出）
  - `dashboardService.ts` - 仪表盘数据服务
  - `residentService.ts` - 住户管理服务（CRUD）
  - `repairService.ts` - 报修工单服务
  - `complaintService.ts` - 投诉服务
  - `announcementService.ts` - 公告服务
  - `propertyUnitService.ts` - 房产单元服务
  - `vehicleService.ts` - 车辆管理服务
  - `feeService.ts` - 收费管理服务

### 2. 已集成的组件

- **LoginPage** (`src/components/LoginPage.tsx`)
  - 使用真实的后端登录 API
  - 处理登录加载状态和错误
  - 正确传递用户信息（username, displayName, roles）

- **Dashboard** (`src/components/Dashboard.tsx`)
  - 从后端获取仪表盘汇总数据
  - 显示加载状态和错误处理
  - 动态展示住户数、收入、报修、投诉等统计数据
  - 支持入住率和缴费率的实时显示

- **ResidentManagement** (`src/components/ResidentManagement.tsx`)
  - 完整的住户 CRUD 操作
  - 列表查询（支持搜索）
  - 新增业主
  - 编辑业主信息
  - 删除业主
  - Toast 通知反馈

### 3. 环境配置

- 开发环境：`.env.development` - API 地址指向 `http://localhost:8080/api`
- 生产环境：`.env.production` - API 地址使用相对路径 `/api`

## 启动说明

### 1. 启动后端服务

```bash
cd backend
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动。

### 2. 启动前端应用

```bash
cd front
npm install  # 首次运行需要安装依赖
npm run dev
```

前端将在 `http://localhost:3000` 启动（已在 vite.config.ts 中配置）。

### 3. 测试账号

根据后端 README 文档，以下是可用的测试账号：

| 账号 | 密码 | 角色 | 说明 |
| ---- | ---- | ---- | ---- |
| admin | 123456 | ADMIN | 系统管理员，拥有全部权限 |
| owner | 123456 | USER | 业主用户，可查看个人相关信息 |
| engineer | 123456 | ENGINEER | 工程人员，负责处理报修工单 |

## 测试功能

### 1. 登录功能测试

1. 打开前端应用 `http://localhost:3000`
2. 选择"管理后台"
3. 使用 `admin` / `123456` 登录
4. 应该能成功登录并跳转到仪表盘

### 2. 仪表盘测试

登录后默认显示仪表盘，应该能看到：
- 总住户数
- 本月收入
- 待处理报修数
- 待处理投诉数
- 入住率
- 缴费率

### 3. 住户管理测试

1. 点击左侧菜单"住户管理"
2. 查看住户列表（应从后端加载数据）
3. 测试搜索功能
4. 点击"新增业主"，填写表单并提交
5. 编辑某个住户信息
6. 删除某个住户（会弹出确认对话框）

## API 接口映射

| 功能 | 前端调用 | 后端接口 |
| ---- | -------- | -------- |
| 登录 | `authService.login()` | `POST /api/auth/login` |
| 仪表盘数据 | `dashboardService.getDashboardSummary()` | `GET /api/dashboard/summary` |
| 住户列表 | `residentService.getResidents()` | `GET /api/residents` |
| 创建住户 | `residentService.createResident()` | `POST /api/residents` |
| 更新住户 | `residentService.updateResident()` | `PUT /api/residents/{id}` |
| 删除住户 | `residentService.deleteResident()` | `DELETE /api/residents/{id}` |

## 待完成的集成

以下组件尚未集成后端 API，仍使用模拟数据：

1. **FeeManagement** - 收费管理
2. **ServiceManagement** - 客户服务（报修、投诉）
3. **CommunityManagement** - 小区管理
4. **SystemManagement** - 系统管理
5. **NotificationCenter** - 通知中心
6. **ResidentPortal** - 业主端
7. **MaintenancePortal** - 维护人员端

## 常见问题

### 1. CORS 跨域错误

如果遇到 CORS 错误，确保后端已配置允许前端域名访问。检查后端的 `SecurityConfig` 配置。

### 2. 401 未授权错误

- 确保已正确登录
- 检查浏览器 LocalStorage 中是否有 `property_mgmt_token`
- Token 可能已过期，重新登录即可

### 3. 网络连接错误

- 确保后端服务正在运行（`http://localhost:8080`）
- 检查 `.env.development` 文件中的 API 地址配置
- 打开浏览器开发者工具的 Network 标签查看请求详情

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Recharts
- Sonner (Toast)

### 后端
- Java 17
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- H2 Database (默认) / MySQL (可选)

## 下一步计划

1. 集成其他管理模块的 API
2. 添加分页组件
3. 优化错误处理和加载状态
4. 添加请求缓存
5. 实现 Token 刷新机制
6. 添加单元测试
