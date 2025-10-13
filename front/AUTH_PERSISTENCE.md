# 登录状态持久化实现文档

## 概述

本文档描述了物业管理系统前端的登录状态持久化实现方案，确保用户登录后能够保持会话状态，并提供完善的token管理和安全机制。

## 后端Token配置

根据后端配置（`application.yml`）：
- **Token类型**: JWT (JSON Web Token)
- **过期时间**: 120分钟（2小时）
- **Token内容**:
  - `sub`: 用户名
  - `roles`: 用户角色列表
  - `iat`: 发布时间
  - `exp`: 过期时间

## 实现特性

### 1. 安全的Token存储

**存储方式**: `localStorage`

**存储内容**:
```typescript
{
  "property_mgmt_token": "JWT token字符串",
  "property_mgmt_token_expiry": "过期时间戳（毫秒）",
  "property_mgmt_user_info": JSON.stringify({
    username: string,
    displayName: string,
    roles: string[]
  })
}
```

**安全措施**:
- Token在localStorage中以原始形式存储（JWT本身已经过签名）
- 每次使用前自动检查token是否过期
- Token过期后自动清除所有认证信息
- 敏感用户数据只包含必要的显示信息，不包含密码等机密数据

### 2. Token过期时间管理

**过期检查机制**:
```typescript
// 解码token获取过期时间
const payload = decodeToken(token);
const expiryTime = payload.exp * 1000; // 转换为毫秒
const isExpired = Date.now() >= expiryTime;
```

**提前预警**:
- 在token过期前15分钟显示警告提示
- 通过Toast通知提醒用户登录即将过期

### 3. 自动Token监控机制

**TokenManager类**:
```typescript
const tokenManager = new TokenManager({
  onTokenExpired: () => {
    toast.error("登录已过期，请重新登录");
    clearAuth();
    navigate("/");
  },
  onTokenExpiringSoon: () => {
    const remaining = getTokenRemainingTime(token);
    toast.warning(`您的登录即将过期，剩余时间：${formatRemainingTime(remaining)}`);
  },
});

// 启动监控（每分钟检查一次）
tokenManager.startMonitoring();
```

**监控机制**:
- 每60秒检查一次token状态
- 检测到token过期立即执行清理和重定向
- 检测到token即将过期时显示警告
- 组件卸载时自动停止监控

### 4. Token失效处理

**自动重定向**:
```typescript
// 在API请求前检查
if (isTokenExpired(token)) {
  clearAuth();
  window.location.href = "/";
  throw new Error("登录已过期，请重新登录");
}

// 接收到401响应时
if (response.status === 401) {
  clearAuth();
  window.location.href = "/";
  throw new Error("未授权，请重新登录");
}
```

**清理机制**:
```typescript
export function clearAuth(): void {
  localStorage.removeItem("property_mgmt_token");
  localStorage.removeItem("property_mgmt_token_expiry");
  localStorage.removeItem("property_mgmt_user_info");
}
```

### 5. 登录状态恢复

**页面刷新后自动恢复**:
```typescript
// App组件初始化时
const [userType, setUserType] = useState(() => {
  // 检查是否有有效token
  if (isAuthenticated()) {
    return "admin"; // 自动恢复为管理员登录状态
  }
  return null;
});

const [userInfo, setUserInfo] = useState(() => {
  // 恢复用户信息
  const stored = getUserInfo();
  return stored ? {
    name: stored.displayName,
    role: stored.roles.includes("ADMIN") ? "管理员" : "用户"
  } : { name: "", role: "" };
});
```

## 核心文件说明

### 1. tokenManager.ts

**位置**: `/front/src/utils/tokenManager.ts`

**功能**:
- JWT token解码
- Token过期检查
- Token存储和读取
- 用户信息管理
- Token监控器类

**主要函数**:
```typescript
// Token解码
decodeToken(token: string): TokenPayload | null

// 过期检查
isTokenExpired(token: string): boolean
isTokenExpiringSoon(token: string): boolean

// 存储管理
saveToken(token: string, userInfo: UserInfo): void
getToken(): string | null
getUserInfo(): UserInfo | null
clearAuth(): void

// 状态检查
isAuthenticated(): boolean
getTokenRemainingTime(token: string): number
```

### 2. apiClient.ts

**更新内容**:
- 使用`tokenManager`替代原有的简单token存储
- 每次请求前自动检查token是否过期
- 401响应自动清除认证信息并重定向

### 3. authService.ts

**更新内容**:
- 登录成功后使用`saveToken`保存token和用户信息
- 登出时使用`clearAuth`清除所有认证数据

### 4. ProtectedRoute.tsx

**位置**: `/front/src/components/ProtectedRoute.tsx`

**功能**: 路由守卫组件
```typescript
<ProtectedRoute redirectTo="/">
  <AdminLayout />
</ProtectedRoute>
```

### 5. App.tsx

**更新内容**:
- 初始化时自动检查并恢复登录状态
- 集成TokenManager进行token监控
- 组件卸载时清理监控定时器

## URL路由支持

**路由配置**:
```typescript
// 管理后台路由
/admin/dashboard      - 仪表盘
/admin/residents      - 住户管理
/admin/fees           - 收费管理
/admin/service        - 客户服务
/admin/community      - 小区管理
/admin/system         - 系统管理
/admin/notifications  - 通知中心
/admin/profile        - 个人中心
```

**特性**:
- 点击导航栏时URL会同步变化
- 刷新页面保持当前页面位置
- 支持浏览器前进/后退按钮
- 未登录访问受保护路由会重定向到登录页

## 安全考虑

### 1. XSS防护
- React默认转义所有用户输入
- Token只用于Authorization header，不在页面中直接渲染

### 2. Token安全
- JWT token由后端签名，前端无法伪造
- Token包含过期时间，过期自动失效
- Token不包含敏感信息（如密码）

### 3. HTTPS建议
- 生产环境建议使用HTTPS传输
- 防止中间人攻击窃取token

### 4. Token刷新
- 当前实现：Token过期前15分钟警告用户
- 未来改进：可实现自动静默刷新机制（需要后端支持refresh token）

## 使用示例

### 登录流程

```typescript
// 1. 用户输入用户名密码
const credentials = { username: "admin", password: "123456" };

// 2. 调用登录API
const response = await login(credentials);

// 3. authService自动保存token和用户信息
// 内部调用：saveToken(token, userInfo)

// 4. App组件更新登录状态
handleAdminLogin(username, displayName, roles);

// 5. TokenManager开始监控token
tokenManager.startMonitoring();
```

### 页面刷新恢复

```typescript
// 1. 页面加载时检查token
if (isAuthenticated()) {
  // 2. Token有效，恢复登录状态
  setUserType("admin");
  setIsLoggedIn(true);

  // 3. 恢复用户信息
  const userInfo = getUserInfo();
  setUserInfo({
    name: userInfo.displayName,
    role: userInfo.roles.includes("ADMIN") ? "管理员" : "用户"
  });
}
```

### Token过期处理

```typescript
// 自动监控检测到过期
onTokenExpired: () => {
  // 1. 显示提示
  toast.error("登录已过期，请重新登录");

  // 2. 清除认证信息
  clearAuth();

  // 3. 重定向到登录页
  navigate("/");
}
```

## 测试清单

- [x] 登录后刷新页面，状态保持
- [x] 登录后关闭浏览器再打开，状态保持（2小时内）
- [x] Token过期后自动清理并重定向
- [x] Token即将过期时显示警告
- [x] 401响应自动处理
- [x] 登出后清除所有认证信息
- [x] URL路由正常工作
- [x] 浏览器前进/后退按钮正常

## 未来改进

1. **Refresh Token机制**
   - 需要后端支持refresh token endpoint
   - 实现自动静默刷新，无需用户重新登录

2. **多标签页同步**
   - 使用localStorage事件监听
   - 一个标签页登出，其他标签页同步

3. **Remember Me功能**
   - 可选的"记住我"选项
   - 使用更长的token有效期

4. **Activity追踪**
   - 追踪用户活动
   - 活跃用户自动延长session

## 相关文档

- [前后端集成说明](/front/INTEGRATION.md)
- [问题修复文档](/FIXES.md)
- [后端API文档](/backend/README.md)
