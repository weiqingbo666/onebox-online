import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email, password, verificationCode } = await req.json();

    if (!email || !password || !verificationCode) {
      return NextResponse.json(
        { error: '请填写所有必填项' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 验证验证码
    const isValidCode = await db.verifyCode(email, verificationCode, 'REGISTER');
    if (!isValidCode) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      );
    }

    // 创建用户
    const user = await db.createUser(email, password);

    // 生成 token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    );
  }
}