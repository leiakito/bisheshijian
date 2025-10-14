-- 更新 residents 表结构，添加新字段
-- 执行此脚本前请先备份数据库

USE property_management;

-- 检查并添加身份证号字段
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'property_management'
AND TABLE_NAME = 'residents'
AND COLUMN_NAME = 'id_card';

SET @query = IF(@col_exists = 0,
  'ALTER TABLE residents ADD COLUMN id_card VARCHAR(50) AFTER phone;',
  'SELECT "Column id_card already exists" AS message;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并添加居住类型字段
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'property_management'
AND TABLE_NAME = 'residents'
AND COLUMN_NAME = 'residence_type';

SET @query = IF(@col_exists = 0,
  'ALTER TABLE residents ADD COLUMN residence_type VARCHAR(20) DEFAULT "OWNER" AFTER area;',
  'SELECT "Column residence_type already exists" AS message;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并添加紧急联系人字段
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'property_management'
AND TABLE_NAME = 'residents'
AND COLUMN_NAME = 'emergency_contact';

SET @query = IF(@col_exists = 0,
  'ALTER TABLE residents ADD COLUMN emergency_contact VARCHAR(50) AFTER move_in_date;',
  'SELECT "Column emergency_contact already exists" AS message;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并添加紧急联系电话字段
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'property_management'
AND TABLE_NAME = 'residents'
AND COLUMN_NAME = 'emergency_phone';

SET @query = IF(@col_exists = 0,
  'ALTER TABLE residents ADD COLUMN emergency_phone VARCHAR(20) AFTER emergency_contact;',
  'SELECT "Column emergency_phone already exists" AS message;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并添加备注字段
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'property_management'
AND TABLE_NAME = 'residents'
AND COLUMN_NAME = 'remark';

SET @query = IF(@col_exists = 0,
  'ALTER TABLE residents ADD COLUMN remark VARCHAR(500) AFTER emergency_phone;',
  'SELECT "Column remark already exists" AS message;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 显示更新后的表结构
SELECT '=== residents table structure ===' AS info;
DESCRIBE residents;
