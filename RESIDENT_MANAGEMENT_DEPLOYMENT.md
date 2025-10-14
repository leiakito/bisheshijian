# 住户管理功能部署说明

## 概述
本次更新完善了住户管理功能，实现了前后端完整对接，包括增删改查等完整功能。

## 更新内容

### 后端更新

#### 1. 数据模型更新 (Resident.java)
新增字段：
- `idCard` - 身份证号
- `residenceType` - 居住类型 (OWNER/TENANT)
- `emergencyContact` - 紧急联系人
- `emergencyPhone` - 紧急联系电话
- `remark` - 备注
- 状态枚举新增 `RENTED` (出租)

#### 2. DTO更新 (ResidentRequest.java)
- 同步更新所有字段
- 添加字段验证

#### 3. Service层更新 (ResidentServiceImpl.java)
- 完善 `applyRequest` 方法，处理所有新字段
- 支持日期格式转换
- 支持枚举类型转换

### 前端更新

#### 1. 类型定义更新 (api.ts)
- 字段名从 `room` 改为 `roomNumber` (与后端一致)
- 新增 `area` 字段
- 完善所有可选字段

#### 2. 组件更新 (ResidentManagement.tsx)
- 实现完整的增删改查功能
- 表单验证
- 错误处理
- 搜索功能
- 分页支持

#### 3. Service更新 (residentService.ts)
- 完善API调用
- 支持分页参数
- 支持搜索参数

## 数据库更新

### 执行SQL脚本

```bash
# 连接到MySQL数据库
mysql -u root -p

# 执行更新脚本
source /Volumes/GT/bisheshijian/backend/update_residents_table.sql
```

或者使用命令行直接执行：

```bash
mysql -u root -p1234567890 < /Volumes/GT/bisheshijian/backend/update_residents_table.sql
```

### 手动执行SQL（如果需要）

```sql
USE property_management;

-- 添加新字段
ALTER TABLE residents ADD COLUMN id_card VARCHAR(50) AFTER phone;
ALTER TABLE residents ADD COLUMN residence_type VARCHAR(20) DEFAULT 'OWNER' AFTER area;
ALTER TABLE residents ADD COLUMN emergency_contact VARCHAR(50) AFTER move_in_date;
ALTER TABLE residents ADD COLUMN emergency_phone VARCHAR(20) AFTER emergency_contact;
ALTER TABLE residents ADD COLUMN remark VARCHAR(500) AFTER emergency_phone;

-- 查看表结构
DESCRIBE residents;
```

## 后端部署

### 1. 编译项目

```bash
cd /Volumes/GT/bisheshijian/backend
./mvnw clean package -DskipTests
```

### 2. 重启应用

```bash
# 停止当前运行的应用
# 启动新版本
java -jar target/property-management-0.0.1-SNAPSHOT.jar
```

## 前端部署

### 1. 安装依赖（如果需要）

```bash
cd /Volumes/GT/bisheshijian/front
npm install
```

### 2. 重新构建

```bash
npm run build
```

### 3. 启动开发服务器（开发环境）

```bash
npm run dev
```

## API接口说明

### 1. 获取住户列表
```
GET /api/residents?keyword={keyword}&status={status}&page={page}&size={size}
```

参数：
- `keyword` (可选): 搜索关键词（姓名、手机号等）
- `status` (可选): 状态过滤 (OCCUPIED/VACANT/RENTED)
- `page` (可选): 页码，默认0
- `size` (可选): 每页大小，默认20

### 2. 创建住户
```
POST /api/residents
Content-Type: application/json

{
  "name": "张三",
  "phone": "13800138000",
  "idCard": "110101199001011234",
  "building": "1号楼",
  "unit": "2单元",
  "roomNumber": "301",
  "area": "120",
  "residenceType": "OWNER",
  "status": "OCCUPIED",
  "moveInDate": "2024-01-01",
  "emergencyContact": "李四",
  "emergencyPhone": "13900139000",
  "remark": "备注信息"
}
```

### 3. 更新住户
```
PUT /api/residents/{id}
Content-Type: application/json

{同创建住户的请求体}
```

### 4. 删除住户
```
DELETE /api/residents/{id}
```

## 功能测试

### 1. 测试新增住户
1. 打开住户管理页面
2. 点击"新增业主"按钮
3. 填写所有必填字段
4. 点击"确定"提交
5. 验证住户是否成功创建

### 2. 测试编辑住户
1. 在住户列表中点击"编辑"按钮
2. 修改住户信息
3. 点击"保存"
4. 验证信息是否更新成功

### 3. 测试搜索功能
1. 在搜索框输入关键词（姓名、手机号、房号等）
2. 验证搜索结果是否正确

### 4. 测试删除功能
1. 点击住户的"删除"按钮
2. 确认删除
3. 验证住户是否被删除

## 注意事项

1. **数据库备份**：在执行SQL更新前，请务必备份数据库
2. **字段兼容性**：新增字段都是可选的，不会影响现有数据
3. **枚举值**：确保前端发送的 `residenceType` 和 `status` 值与后端枚举定义一致
4. **日期格式**：前端发送日期格式为 `YYYY-MM-DD`
5. **验证规则**：后端必填字段为 `name`, `phone`, `idCard`, `building`, `unit`, `roomNumber`

## 故障排查

### 问题1：字段不存在错误
**症状**：API返回字段不存在错误
**解决**：确认数据库表已更新，执行 `DESCRIBE residents;` 查看表结构

### 问题2：枚举值错误
**症状**：保存时提示枚举值不正确
**解决**：检查前端发送的值是否为大写 (OWNER/TENANT, OCCUPIED/VACANT/RENTED)

### 问题3：日期格式错误
**症状**：日期字段保存失败
**解决**：确保前端发送的日期格式为 `YYYY-MM-DD`

### 问题4：搜索无结果
**症状**：搜索时无法找到数据
**解决**：检查后端日志，确认搜索参数是否正确传递

## 相关文件

### 后端文件
- `/backend/src/main/java/com/propertymgmt/property/model/Resident.java`
- `/backend/src/main/java/com/propertymgmt/property/dto/ResidentRequest.java`
- `/backend/src/main/java/com/propertymgmt/property/controller/ResidentController.java`
- `/backend/src/main/java/com/propertymgmt/property/service/impl/ResidentServiceImpl.java`

### 前端文件
- `/front/src/components/ResidentManagement.tsx`
- `/front/src/services/residentService.ts`
- `/front/src/types/api.ts`

### 数据库文件
- `/backend/update_residents_table.sql`

## 联系支持

如有问题，请查看：
1. 后端日志：`/backend/logs/`
2. 前端控制台：浏览器开发者工具
3. 数据库日志：MySQL错误日志
