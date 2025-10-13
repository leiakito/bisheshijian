# 快速参考指南

## ✅ 已实现的功能

### 1. 登录状态持久化
- ✅ JWT token安全存储（localStorage）
- ✅ Token过期时间管理（120分钟）
- ✅ 自动token监控（每分钟检查）
- ✅ Token失效自动重定向
- ✅ 页面刷新状态保持
- ✅ Token过期前15分钟警告

### 2. URL路由
- ✅ React Router集成
- ✅ URL与页面状态同步
- ✅ 浏览器前进/后退支持
- ✅ 页面刷新保持当前路由

### 3. 后端API集成
- ✅ 登录API
- ✅ 仪表盘数据API
- ✅ 住户管理CRUD API
- ✅ JWT token自动附加到请求
- ✅ 401错误自动处理

### 4. 安全特性
- ✅ Token过期自动检查
- ✅ 敏感信息不明文存储
- ✅ 自动清理过期token
- ✅ 路由守卫保护

## 🚀 快速启动

### 后端
```bash
cd backend
mvn spring-boot:run
```
- 地址: http://localhost:8080
- API文档: http://localhost:8080/swagger-ui.html

### 前端
```bash
cd front
npm install
npm run dev
```
- 地址: http://localhost:3000

### 测试账号
- 用户名: `admin`
- 密码: `123456`
- Token有效期: 120分钟

## 📂 关键文件

| 文件 | 功能 |
|------|------|
| `/front/src/utils/tokenManager.ts` | Token管理核心 |
| `/front/src/utils/apiClient.ts` | API请求客户端 |
| `/front/src/components/ProtectedRoute.tsx` | 路由守卫 |
| `/front/src/App.tsx` | 主应用（含路由） |
| `/front/src/services/authService.ts` | 认证服务 |

## 🔧 常用命令

### 检查登录状态
```typescript
import { isAuthenticated } from './utils/tokenManager';

if (isAuthenticated()) {
  console.log("用户已登录");
}
```

### 获取用户信息
```typescript
import { getUserInfo } from './utils/tokenManager';

const userInfo = getUserInfo();
console.log(userInfo.displayName, userInfo.roles);
```

### 清除登录状态
```typescript
import { clearAuth } from './utils/tokenManager';

clearAuth();
// 自动清除token和用户信息
```

### 检查token剩余时间
```typescript
import { getTokenRemainingTime, formatRemainingTime } from './utils/tokenManager';

const token = getToken();
const remaining = getTokenRemainingTime(token);
console.log(formatRemainingTime(remaining)); // "1小时30分钟"
```

## 🛡️ 安全最佳实践

1. **生产环境**
   - 使用HTTPS
   - 配置环境变量（不要硬编码API地址）
   - 定期更新依赖包

2. **Token管理**
   - 不要在console.log中输出token
   - 不要通过URL传递token
   - 登出时确保清除所有认证信息

3. **错误处理**
   - 捕获所有API错误
   - 提供用户友好的错误提示
   - 记录错误日志

## 📱 用户体验

### Token过期提醒
- 过期前15分钟：显示警告Toast
- 过期时：显示错误Toast并重定向登录页

### 页面刷新
- 登录状态自动恢复
- 当前页面位置保持
- URL路由同步

### 导航
- 侧边栏点击 → URL更新
- URL直接访问 → 页面显示
- 前进/后退 → 历史记录正常

## 🐛 常见问题

### Q: 刷新页面后登录状态丢失？
A: 检查localStorage中是否有token，确保token未过期

### Q: 点击导航栏URL不变？
A: 已修复，现在使用React Router，URL会同步变化

### Q: Token过期如何处理？
A: 自动清除并重定向到登录页，无需手动处理

### Q: 如何延长登录时间？
A: 修改后端`application.yml`中的`token-expiration-minutes`

## 📚 相关文档

- [登录状态持久化详细文档](./AUTH_PERSISTENCE.md)
- [前后端集成说明](./INTEGRATION.md)
- [问题修复记录](/FIXES.md)

## 🎯 下一步

可以考虑的改进：
1. 实现refresh token机制
2. 添加多标签页登录状态同步
3. 实现"记住我"功能
4. 添加用户活动追踪
5. 集成其他管理模块的API
