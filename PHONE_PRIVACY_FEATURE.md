# 电话号码隐私保护功能说明

## 功能概述
为保护住户隐私，在住户管理列表中，电话号码将自动隐藏中间四位，显示为星号。只有在编辑操作时才会显示完整的电话号码。

## 实现细节

### 隐藏规则
- **显示格式**: `138****0000`
- **隐藏位数**: 中间4位数字
- **保留位数**: 前3位 + 后4位

### 代码实现

#### 隐藏函数 (ResidentManagement.tsx:176-180)
```typescript
const maskPhoneNumber = (phone: string) => {
  if (!phone || phone.length < 7) return phone;
  // 保留前3位和后4位，中间用****替代
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};
```

#### 使用位置
- **列表显示** (ResidentManagement.tsx:572)
  ```typescript
  <TableCell>{maskPhoneNumber(resident.phone)}</TableCell>
  ```
  在住户列表表格中，电话号码列使用 `maskPhoneNumber` 函数进行隐藏处理

- **编辑对话框** (ResidentManagement.tsx:95-113)
  ```typescript
  const handleEdit = (resident: Resident) => {
    setFormData({
      ...
      phone: resident.phone, // 直接使用完整电话号码
      ...
    });
  };
  ```
  在编辑对话框中，表单字段使用完整的电话号码，允许管理员查看和修改

## 功能演示

### 1. 列表显示
```
姓名      联系电话        房屋地址
张三      138****0000     1号楼 2单元 301
李四      139****1111     1号楼 2单元 302
王五      136****2222     2号楼 1单元 201
```

### 2. 编辑对话框
点击"编辑"按钮后，编辑对话框中的"联系电话"字段将显示完整号码：
```
联系电话: 13800138000
```

## 兼容性说明

### 支持的电话格式
- ✅ 11位手机号: `13800138000` → `138****0000`
- ✅ 带区号固话: `01012345678` → `010****5678`
- ⚠️ 短号码: 少于7位的号码不会隐藏（直接显示原号码）

### 正则表达式解析
```javascript
phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
```

- `(\d{3})` - 捕获前3位数字
- `\d{4}` - 匹配中间4位数字（将被替换）
- `(\d{4})` - 捕获后4位数字
- `$1****$2` - 用前3位 + **** + 后4位组成新字符串

## 安全考虑

### 1. 前端隐藏 vs 后端隐藏
**当前实现**: 前端隐藏（前端接收完整数据，仅在显示时隐藏）

**优点**:
- 编辑时可直接使用完整数据
- 不需要额外的API调用获取完整号码
- 实现简单

**缺点**:
- 完整电话号码仍会在网络传输中出现
- 有技术能力的用户可通过浏览器开发者工具查看

**建议**:
- 如需更高安全性，可在后端实现两个API：
  1. 列表API返回隐藏后的号码
  2. 详情/编辑API返回完整号码

### 2. 权限控制
建议配合权限系统使用：
- 普通工作人员：只能看到隐藏后的号码
- 管理员/主管：可以看到完整号码

## 扩展功能建议

### 1. 可配置的隐藏规则
```typescript
interface MaskConfig {
  prefixLength: number;  // 前面保留几位
  maskLength: number;    // 隐藏几位
  suffixLength: number;  // 后面保留几位
}

const maskPhoneNumber = (phone: string, config: MaskConfig) => {
  const { prefixLength, maskLength, suffixLength } = config;
  const prefix = phone.substring(0, prefixLength);
  const suffix = phone.substring(phone.length - suffixLength);
  return `${prefix}${'*'.repeat(maskLength)}${suffix}`;
};
```

### 2. 其他隐私字段
可以应用相同的隐藏逻辑到：
- 身份证号: `110101********1234`
- 邮箱: `zhang***@example.com`
- 地址: `北京市朝阳区******小区`

### 3. 查看权限控制
添加"查看完整号码"按钮，需要二次确认或输入密码：
```typescript
<Button
  variant="ghost"
  size="sm"
  onClick={() => handleViewFullPhone(resident.id)}
>
  <Eye className="w-4 h-4" />
  查看完整号码
</Button>
```

## 测试用例

### 测试场景1: 列表显示
1. 打开住户管理页面
2. 查看联系电话列
3. ✅ 预期结果: 电话号码显示为 `138****0000` 格式

### 测试场景2: 编辑显示
1. 点击某个住户的"编辑"按钮
2. 查看编辑对话框中的"联系电话"字段
3. ✅ 预期结果: 显示完整电话号码 `13800138000`

### 测试场景3: 搜索功能
1. 在搜索框输入完整或部分电话号码
2. 查看搜索结果
3. ✅ 预期结果: 能够正常搜索到对应住户（后端搜索使用完整号码）

### 测试场景4: 新增住户
1. 点击"新增业主"按钮
2. 填写电话号码
3. 保存后查看列表
4. ✅ 预期结果: 新增的住户电话号码也被正确隐藏

## 相关文件

- `/front/src/components/ResidentManagement.tsx` - 主要实现文件
- `maskPhoneNumber` 函数 (第176-180行) - 隐藏逻辑
- 列表渲染 (第572行) - 使用隐藏函数
- 编辑处理 (第95-113行) - 显示完整号码

## 技术栈

- React 18
- TypeScript
- 正则表达式

## 更新日期
2025-01-15
