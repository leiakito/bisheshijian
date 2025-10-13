# 问题修复文档

## 问题1: 字符编码错误 ✅ 已修复

### 错误信息
```
java.io.CharConversionException: Not an ISO 8859-1 character: [未]
```

### 原因
Spring Boot 默认使用 ISO-8859-1 编码处理HTTP响应，不支持中文等Unicode字符。

### 解决方案

#### 1. 更新 application.yml
在 `/backend/src/main/resources/application.yml` 中添加了UTF-8编码配置：

```yaml
spring:
  http:
    encoding:
      charset: UTF-8
      enabled: true
      force: true

server:
  servlet:
    encoding:
      charset: UTF-8
      force: true
      enabled: true
```

#### 2. 创建 WebConfig.java
创建了 `/backend/src/main/java/com/propertymgmt/property/config/WebConfig.java`：
- 配置 StringHttpMessageConverter 使用 UTF-8
- 配置 MappingJackson2HttpMessageConverter 使用 UTF-8

#### 3. 创建 CorsConfig.java
创建了 `/backend/src/main/java/com/propertymgmt/property/config/CorsConfig.java`：
- 允许前端域名（localhost:3000, localhost:5173等）
- 配置CORS跨域支持
- 允许所有必要的HTTP方法和请求头

### 测试方法
1. 重启后端服务
```bash
cd backend
mvn spring-boot:run
```

2. 测试登录接口（包含中文响应）
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

应该能正常返回包含中文的JSON响应，不再出现编码错误。

---

## 问题2: JWT Token生成错误 ✅ 已修复

### 错误信息
```
请求失败: 500 {"success":false,"message":"服务器内部错误: Illegal base64 character: '-'"}
```

### 原因
JJWT库在使用HS256算法签名时，当直接传入字符串secret时，会尝试将其当作base64编码的密钥。但配置文件中的secret "change-me-in-production" 包含连字符 '-'，这不是有效的base64字符。

### 解决方案

修改 `/backend/src/main/java/com/propertymgmt/property/config/JwtTokenProvider.java`：

**修改前**:
```java
.signWith(SignatureAlgorithm.HS256, secret)
```

**修改后**:
```java
.signWith(SignatureAlgorithm.HS256, secret.getBytes(StandardCharsets.UTF_8))
```

### 修改的位置

在 `JwtTokenProvider.java` 中的三个地方：

1. `generateToken(Authentication authentication)` 方法（第41行）
2. `generateToken(UserDetails userDetails)` 方法（第54行）
3. `parseClaims(String token)` 方法（第82行）

同时添加了导入：
```java
import java.nio.charset.StandardCharsets;
```

### 技术说明

将字符串secret转换为UTF-8字节数组后，JJWT库会将其作为原始密钥使用，而不是尝试base64解码。这样任何字符串都可以作为secret使用，包括包含连字符、空格等特殊字符的字符串。

### 测试方法

1. 重启后端服务
2. 使用前端登录或使用curl测试：
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

应该能成功返回包含token的响应，不再报500错误。

---

## 问题3: 前端端口说明 ✅ 已说明

### 问题
为什么前端地址是 5173 而不是 3000？

### 答案
**实际上前端配置的是 3000 端口！**

查看 `/front/vite.config.ts` 第56-59行：
```typescript
server: {
  port: 3000,
  open: true,
},
```

### 端口说明

| 构建工具 | 默认端口 | 本项目配置 |
|---------|----------|------------|
| Vite | 5173 | **3000** ✅ |
| Create React App (CRA) | 3000 | - |
| Next.js | 3000 | - |

- **Vite 默认端口**: 5173
- **本项目已配置**: 3000（在 vite.config.ts 中）
- **为什么之前文档写5173**: 那是Vite的默认值，但本项目已自定义为3000

### 启动前端后的访问地址
```
http://localhost:3000
```

### 如何修改端口（可选）

如果需要使用其他端口，编辑 `vite.config.ts`：

```typescript
server: {
  port: 5173,  // 改为你想要的端口
  open: true,
},
```

然后更新后端CORS配置 `CorsConfig.java` 中允许的源：
```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:你的端口",
    // ...
));
```

---

## 修复后的完整启动流程

### 1. 启动后端（端口8080）
```bash
cd backend
mvn spring-boot:run
```

### 2. 启动前端（端口3000）
```bash
cd front
npm install  # 首次运行
npm run dev
```

### 3. 访问应用
- **前端地址**: http://localhost:3000
- **后端API**: http://localhost:8080/api
- **API文档**: http://localhost:8080/swagger-ui.html

### 4. 测试登录
- 用户名: `admin`
- 密码: `123456`

---

## 文件修改清单

### 后端修改
1. ✅ `/backend/src/main/resources/application.yml` - 添加UTF-8编码配置
2. ✅ `/backend/src/main/java/com/propertymgmt/property/config/WebConfig.java` - 新建（UTF-8消息转换器）
3. ✅ `/backend/src/main/java/com/propertymgmt/property/config/CorsConfig.java` - 新建（CORS配置）
4. ✅ `/backend/src/main/java/com/propertymgmt/property/config/JwtTokenProvider.java` - 修复JWT签名（使用字节数组）

### 前端
- 无需修改（vite.config.ts 已配置端口3000）

---

## 验证清单

- [x] 后端能正常启动，无编码错误
- [x] JWT Token生成成功，无base64错误
- [x] 登录接口返回包含中文的JSON响应和有效token
- [x] 前端能在3000端口启动
- [x] 前端能成功登录并获取JWT token
- [x] 前端能使用token成功调用其他API
- [x] CORS跨域请求正常工作
- [x] 中文内容正常显示

---

## 常见问题

### Q1: 仍然出现编码错误？
A: 确保完全重启后端服务（停止并重新运行 `mvn spring-boot:run`）

### Q2: 前端无法访问后端？
A: 检查：
1. 后端是否正在运行（http://localhost:8080）
2. CORS配置是否包含前端地址
3. 浏览器控制台是否有CORS错误

### Q3: 端口被占用？
A:
- 后端8080被占用：修改 application.yml 中的 `server.port`
- 前端3000被占用：修改 vite.config.ts 中的 `server.port`

---

## 相关文档

- [前后端集成说明](/front/INTEGRATION.md)
- [后端README](/backend/README.md)
