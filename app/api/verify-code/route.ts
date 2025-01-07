import { NextRequest, NextResponse } from 'next/server';
import { Database } from '../../../db';
import pool from '../../../db/config';
import { generateToken } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: '邮箱和验证码不能为空' },
        { status: 400 }
      );
    }

    // 验证验证码
    const isValid = await Database.verifyCode(email, code, 'LOGIN');
    if (!isValid) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      );
    }

    // 从用户表中获取或创建用户
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    let user = (rows as any[])[0];
    
    if (!user) {
      // 如果用户不存在，创建一个新用户
      const [result] = await pool.execute(
        'INSERT INTO users (email) VALUES (?)',
        [email]
      );
      const [newUser] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [(result as any).insertId]
      );
      user = (newUser as any[])[0];
    }

    // 生成 JWT token
    const token = generateToken(user);

    return NextResponse.json({
      user,
      token
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: '验证失败，请重试' },
      { status: 500 }
    );
  }
}
