-- 更新 sys_users 表结构，添加住户关联字段
-- 执行此脚本前请先备份数据库

USE property_management;

-- 检查并添加住户ID字段
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'property_management'
AND TABLE_NAME = 'sys_users'
AND COLUMN_NAME = 'resident_id';

SET @query = IF(@col_exists = 0,
  'ALTER TABLE sys_users ADD COLUMN resident_id BIGINT AFTER email;',
  'SELECT "Column resident_id already exists" AS message;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加外键约束（如果列刚创建）
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'property_management'
AND TABLE_NAME = 'sys_users'
AND CONSTRAINT_NAME = 'fk_user_resident';

SET @query = IF(@fk_exists = 0 AND @col_exists = 0,
  'ALTER TABLE sys_users ADD CONSTRAINT fk_user_resident FOREIGN KEY (resident_id) REFERENCES residents(id);',
  'SELECT "Foreign key fk_user_resident already exists or not needed" AS message;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 显示更新后的表结构
SELECT '=== sys_users table structure ===' AS info;
DESCRIBE sys_users;
