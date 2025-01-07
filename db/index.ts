import pool from './config';
import bcrypt from 'bcryptjs';

// 定义用户的接口
export interface User {
  id: number;
  email: string;
  password_hash?: string;
  created_at: Date;
}

// 定义验证码的接口
export interface VerificationCode {
  id: number;
  email: string;
  code: string;
  type: 'LOGIN' | 'REGISTER';
  expires_at: Date;
  created_at: Date;
}

// 数据库操作类
class Database {
  // 保存验证码
  async saveVerificationCode(email: string, code: string, type: 'LOGIN' | 'REGISTER') {
    try {
      // Set expiration time to 10 minutes from now
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      const [result] = await pool.execute(
        `INSERT INTO verification_codes (email, code, type, expires_at)
         VALUES (?, ?, ?, ?)`,
        [email, code, type, expiresAt]
      );
      return result;
    } catch (error) {
      console.error('Error saving verification code:', error);
      throw error;
    }
  }

  // 验证验证码
  async verifyCode(email: string, code: string, type: 'LOGIN' | 'REGISTER') {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM verification_codes 
         WHERE email = ? AND code = ? AND type = ? AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [email, code, type]
      );

      if ((rows as any[]).length > 0) {
        // 删除已使用的验证码
        await pool.execute(
          'DELETE FROM verification_codes WHERE id = ?',
          [(rows as any[])[0].id]
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }

  // 创建用户
  async createUser(email: string, password?: string) {
    try {
      let passwordHash = null;
      if (password) {
        passwordHash = await bcrypt.hash(password, 10);
      }

      const [result] = await pool.execute(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [email, passwordHash]
      );

      // @ts-ignore
      return { id: result.insertId, email };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // 根据邮箱查找用户
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return (rows as User[])[0] || null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // 验证密码
  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password_hash) return false;
    return bcrypt.compare(password, user.password_hash);
  }

  // 更新用户密码
  async updatePassword(userId: number, password: string) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [passwordHash, userId]
      );
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  // 清理过期的验证码
  async cleanupExpiredCodes() {
    try {
      await pool.execute(
        'DELETE FROM verification_codes WHERE expires_at <= NOW()'
      );
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
      throw error;
    }
  }
}

// 导出数据库实例
export const db = new Database();
