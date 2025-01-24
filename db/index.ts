import pool from './config';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

export interface VerificationCode {
  id: number;
  email: string;
  code: string;
  type: 'LOGIN' | 'REGISTER';
  expires_at: Date;
  created_at: Date;
}

export class Database {
  // 测试数据库连接
  static async testConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database');
      connection.release();
      return true;
    } catch (error) {
      console.error('Error connecting to database:', error);
      return false;
    }
  }

  // 创建用户
  static async createUser(email: string, password?: string): Promise<User> {
    try {
      let password_hash = null;
      if (password) {
        password_hash = await bcrypt.hash(password, 10);
      }

      const [result] = await pool.execute(
        `INSERT INTO oneboxusers (email, password_hash) VALUES (?, ?)`,
        [email, password_hash]
      );

      const [user] = await pool.execute(
        'SELECT * FROM oneboxusers WHERE id = ?',
        [(result as any).insertId]
      );

      return (user as any[])[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // 通过邮箱查找用户
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM oneboxusers WHERE email = ?',
        [email]
      );
      const users = rows as User[];
      return users[0] || null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // 验证密码
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password_hash) return false;
    return bcrypt.compare(password, user.password_hash);
  }

  // 保存验证码
  static async saveVerificationCode(email: string, code: string, type: 'LOGIN' | 'REGISTER') {
    try {
      // 设置过期时间为10分钟后
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      // 删除该邮箱之前的验证码
      await pool.execute(
        'DELETE FROM verification_codes WHERE email = ? AND type = ?',
        [email, type]
      );

      // 保存新的验证码，使用UTC时间
      const [result] = await pool.execute(
        `INSERT INTO verification_codes (email, code, type, expires_at)
         VALUES (?, ?, ?, ?)`,
        [email, code, type, expiresAt]
      );

      // 记录保存的验证码信息（用于调试）
      console.log('Verification code saved:', {
        email,
        code,
        type,
        expiresAt
      });

      return result;
    } catch (error) {
      console.error('Error saving verification code:', error);
      throw error;
    }
  }

  // 验证验证码
  static async verifyCode(email: string, code: string, type: 'LOGIN' | 'REGISTER'): Promise<boolean> {
    try {
      console.log('Verifying code with params:', {
        email,
        code,
        type,
        currentTime: new Date().toISOString()
      });

      // 首先检查是否存在任何验证码记录
      const [allCodes] = await pool.execute(
        `SELECT * FROM verification_codes 
         WHERE email = ? 
         AND type = ?
         ORDER BY created_at DESC LIMIT 1`,
        [email, type]
      );
      
      console.log('Found verification codes:', allCodes);

      if (Array.isArray(allCodes) && allCodes.length === 0) {
        console.log('No verification code found for this email');
        return false;
      }

      // 获取有效的验证码
      const [rows] = await pool.execute(
        `SELECT *, NOW() as current_time FROM verification_codes 
         WHERE email = ? 
         AND UPPER(code) = UPPER(?) 
         AND type = ? 
         AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [email, code, type]
      );
      
      const codes = rows as any[];
      
      if (codes.length === 0) {
        // 获取最近的验证码记录（包括已过期的）用于调试
        const [expiredCodes] = await pool.execute(
          `SELECT *, NOW() as current_time FROM verification_codes 
           WHERE email = ? 
           AND type = ?
           ORDER BY created_at DESC LIMIT 1`,
          [email, type]
        );
        
        console.log('No valid code found. Debug info:', {
          expiredCodes,
          currentTime: new Date().toISOString(),
          serverTime: (expiredCodes as any[])[0]?.current_time
        });
        
        return false;
      }

      const validCode = codes[0];
      console.log('Valid code found:', {
        codeDetails: {
          ...validCode,
          password: undefined // 不记录密码
        },
        currentTime: new Date().toISOString(),
        serverTime: validCode.current_time
      });

      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }
}
