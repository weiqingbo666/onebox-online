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

      console.log('Creating user:', { 
        email,
        hasPassword: !!password,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      const [result] = await pool.execute(
        `INSERT INTO oneboxusers (email, password_hash) VALUES (?, ?)`,
        [email, password_hash]
      );

      if (!(result as any).insertId) {
        throw new Error('Failed to insert user');
      }

      const [userRows] = await pool.execute(
        'SELECT * FROM oneboxusers WHERE id = ?',
        [(result as any).insertId]
      );

      const users = userRows as any[];
      if (!users || users.length === 0) {
        throw new Error('User created but not found');
      }

      console.log('User created successfully:', {
        email,
        userId: users[0].id,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      return users[0];
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error && error.message.includes('Duplicate entry')) {
        throw new Error('该邮箱已被注册');
      }
      throw error;
    }
  }

  // 通过邮箱查找用户
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      console.log('Finding user by email:', {
        email,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      const [rows] = await pool.execute(
        'SELECT * FROM oneboxusers WHERE email = ?',
        [email]
      );
      
      const users = rows as User[];
      const found = users[0] || null;

      console.log('User search result:', {
        email,
        found: !!found,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      return found;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // 验证密码
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      if (!user.password_hash) {
        console.log('Password verification failed: No password hash', {
          userId: user.id,
          email: user.email
        });
        return false;
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      console.log('Password verification result:', {
        userId: user.id,
        email: user.email,
        isValid,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      return isValid;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // 保存验证码
  static async saveVerificationCode(email: string, code: string, type: 'LOGIN' | 'REGISTER') {
    try {
      // 设置过期时间为10分钟后，使用本地时间
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

      // 手动格式化日期为MySQL datetime格式 (YYYY-MM-DD HH:mm:ss)
      const pad = (num: number) => num.toString().padStart(2, '0');
      const formattedExpiresAt = `${expiresAt.getFullYear()}-${pad(expiresAt.getMonth() + 1)}-${pad(expiresAt.getDate())} ${pad(expiresAt.getHours())}:${pad(expiresAt.getMinutes())}:${pad(expiresAt.getSeconds())}`;
      
      // 删除该邮箱之前的验证码
      await pool.execute(
        'DELETE FROM verification_codes WHERE email = ? AND type = ?',
        [email, type]
      );

      // 保存新的验证码
      const [result] = await pool.execute(
        'INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, ?, ?)',
        [email, code, type, formattedExpiresAt]
      );

      console.log('Verification code saved:', {
        email,
        expiresAt: formattedExpiresAt,
        currentTime: now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
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
      const now = new Date();
      const pad = (num: number) => num.toString().padStart(2, '0');
      const formattedNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      console.log('Verifying code with params:', {
        email,
        code,
        type,
        currentTime: formattedNow
      });

      // 获取验证码记录并检查是否过期
      const [rows] = await pool.execute(
        'SELECT * FROM verification_codes WHERE email = ? AND code = ? AND type = ? AND expires_at > ? ORDER BY created_at DESC LIMIT 1',
        [email, code, type, formattedNow]
      );
      
      const codes = rows as any[];
      const isValid = codes.length > 0;
      
      console.log('Code validation:', {
        found: codes.length > 0,
        isValid,
        currentTime: formattedNow
      });

      return isValid;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }
}
