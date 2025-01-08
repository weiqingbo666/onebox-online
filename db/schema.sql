-- 创建用户表
CREATE TABLE IF NOT EXISTS oneboxusers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建验证码表
CREATE TABLE IF NOT EXISTS verification_codes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type ENUM('LOGIN', 'REGISTER') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email_type (email, type),
  INDEX idx_email_code_type (email, code, type),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建清理过期验证码的事件
SET GLOBAL event_scheduler = ON;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS cleanup_verification_codes()
BEGIN
    DELETE FROM verification_codes WHERE expires_at <= NOW();
END //
DELIMITER ;

-- 创建定时清理事件
CREATE EVENT IF NOT EXISTS cleanup_verification_codes_event
    ON SCHEDULE
        EVERY 10 MINUTE
        STARTS CURRENT_TIMESTAMP
    DO
        CALL cleanup_verification_codes();
