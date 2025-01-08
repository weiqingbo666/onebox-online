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
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
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
  static async verifyCode(email: string, code: string, type: 'LOGIN' | 'REGISTER'): Promise<boolean> {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM verification_codes 
         WHERE email = ? AND code = ? AND type = ? AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [email, code, type]
      );
      
      const codes = rows as VerificationCode[];
      return codes.length > 0;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }
}
