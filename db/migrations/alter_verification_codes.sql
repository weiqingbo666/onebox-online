-- 修改验证码字段长度
ALTER TABLE verification_codes MODIFY COLUMN code VARCHAR(10) NOT NULL;
