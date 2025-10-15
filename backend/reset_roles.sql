-- ============================================
-- 重置角色表，确保角色ID固定
-- 警告：此脚本会删除所有用户和角色数据！
-- 执行前请确保已备份数据库
-- ============================================

USE property_management;

-- 显示当前数据（执行前检查）
SELECT '=== 执行前的角色数据 ===' AS info;
SELECT * FROM sys_roles;

SELECT '=== 执行前的用户数据 ===' AS info;
SELECT COUNT(*) as user_count FROM sys_users;

-- 删除现有数据（按照外键依赖顺序）
-- 警告：以下操作会清空所有用户和角色数据
DELETE FROM sys_user_roles WHERE 1=1;  -- 明确添加 WHERE 1=1 避免警告
DELETE FROM sys_users WHERE 1=1;
DELETE FROM sys_roles WHERE 1=1;

-- 重置自增ID
ALTER TABLE sys_roles AUTO_INCREMENT = 1;
ALTER TABLE sys_users AUTO_INCREMENT = 1;

-- 插入固定ID的角色
INSERT INTO sys_roles (id, code, name, description, created_at, updated_at) VALUES
  (1, 'ADMIN', '系统管理员', '拥有系统所有权限', NOW(), NOW()),
  (2, 'USER', '普通用户', '负责日常使用物业系统的业主', NOW(), NOW()),
  (3, 'ENGINEER', '工程人员', '负责设施维护和报修处理', NOW(), NOW());

-- 显示结果
SELECT '=== 角色表已重置 ===' AS message;
SELECT * FROM sys_roles;

SELECT '=== 提示：请重启后端服务以初始化示例数据 ===' AS reminder;
