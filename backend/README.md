# 物业管理系统后端

基于 Spring Boot 3.x 构建的后端服务，为管理端、业主端、维护人员端提供统一的 RESTful API，覆盖登录认证、仪表盘统计、住户管理、收费管理、客户服务和公告通知等核心模块。

## 技术栈

- Java 17
- Spring Boot 3.2
- Spring Web / Validation
- Spring Data JPA（默认使用内存 H2，提供 MySQL 配置）
- Spring Security + JWT（无状态鉴权 + RBAC）
- SpringDoc OpenAPI 3（交互式接口文档）
- Lombok

## 快速开始

### 1. 准备环境

- 安装 JDK 17+
- 安装 Maven 3.9+
- （可选）安装 Docker，用于启动 MySQL

### 2. 克隆并进入项目

```bash
cd backend
```

### 3. 以内存数据库运行（推荐快速体验）

```bash
mvn spring-boot:run
```

启动后服务监听在 `http://localhost:8080`，常用接口示例：

- `POST /api/auth/login`（获取 JWT Token）
- `GET /api/dashboard/summary`（需在 Header 中携带 `Authorization: Bearer <token>`）
- `GET /api/residents`

示例登录请求：

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

### 4. 切换到 MySQL

1. 启动数据库（Docker 示例）：
   ```bash
   docker compose up -d
   ```
2. 使用 MySQL Profile 运行：
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
3. 数据库默认用户：`property / property123`，数据库名 `property_management`

> 首次运行会自动建表并加载演示数据，可直接通过接口查看。

### 5. 账号与角色（内置示例）

| 账号 | 密码 | 角色 | 说明 |
| ---- | ---- | ---- | ---- |
| admin | 123456 | ADMIN | 系统管理员，拥有全部权限 |
| owner | 123456 | USER | 业主用户，可查看个人相关信息并提交诉求 |
| engineer | 123456 | ENGINEER | 工程人员，负责处理报修工单 |

## 目录结构

```
backend/
├── pom.xml
├── docker-compose.yml
├── README.md
└── src
    ├── main
    │   ├── java/com/propertymgmt/property
    │   │   ├── PropertyBackendApplication.java
    │   │   ├── bootstrap/DataSeeder.java      # 演示数据初始化
    │   │   ├── config/                       # 安全配置、JWT 组件
    │   │   ├── controller/                   # REST 控制器
    │   │   ├── dto/                          # 请求 / 响应模型
    │   │   ├── model/                        # JPA 实体
    │   │   ├── repository/                   # 数据访问层
    │   │   └── service/                      # 业务服务
    │   └── resources/application.yml         # H2 默认配置 + MySQL Profile
    └── test                                  # 预留
```

## 主要接口概览

| 模块 | 方法 | 路径 | 说明 |
| ---- | ---- | ---- | ---- |
| 认证 | POST | `/api/auth/login` | 用户登录，返回 JWT Token、角色信息 |
| 仪表盘 | GET | `/api/dashboard/summary` | 返回住户数、收入、报修/投诉统计 |
| 住户管理 | GET | `/api/residents` | 住户分页查询，支持 `keyword`、`status` 筛选 |
| 住户管理 | POST | `/api/residents` | 新增业主信息 |
| 住户管理 | PUT | `/api/residents/{id}` | 更新业主信息 |
| 住户管理 | DELETE | `/api/residents/{id}` | 删除业主信息 |
| 房产信息 | GET | `/api/property-units` | 房源分页查询，支持关键词/状态筛选 |
| 车辆管理 | GET | `/api/vehicles` | 车辆分页查询，支持关键词/类型筛选 |
| 收费管理 | GET | `/api/fees/bills` | 账单列表 |
| 客户服务 | GET | `/api/complaints` | 投诉列表 |
| 客户服务 | POST | `/api/complaints` | 新增投诉 |
| 报修管理 | GET | `/api/repairs` | 工单列表 |
| 报修管理 | POST | `/api/repairs` | 新建工单 |
| 报修管理 | PUT | `/api/repairs/{id}/status` | 更新工单状态 |
| 公告中心 | GET | `/api/announcements` | 最新公告（GET 允许匿名访问） |

> 除明确标注的匿名接口外，其他请求均需在 Header 中附带 `Authorization: Bearer <token>`，并由后端基于角色进行 RBAC 校验。

## 下一步规划

1. **JWT 刷新 / 注销**：加入刷新 Token、黑名单/登出机制。
2. **RBAC 细化**：补齐用户、角色、权限管理接口，支持菜单粒度授权。
3. **查询能力增强**：补充分页排序、组合筛选、DTO 映射与数据导出等能力。
4. **真实数据库**：使用 Flyway/Liquibase 管理数据库版本，支持多环境部署。
5. **自动化测试**：补充单元测试与接口测试，保证核心流程稳定。
6. **文件与报表**：支持报修图片上传、账单导出、统计报表生成等扩展功能。

如需联调前端，请将前端项目中的接口地址指向 `http://localhost:8080`，并根据需要调整字段映射。
