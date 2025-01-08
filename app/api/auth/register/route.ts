import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, verificationCode } = await request.json();

    if (!email || !password || !verificationCode) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 验证验证码
    const isValid = await Database.verifyCode(email, verificationCode, 'REGISTER');
    if (!isValid) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已被注册
    const existingUser = await Database.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 创建新用户
    const user = await Database.createUser(email, password);
    const token = generateToken(user);

    return NextResponse.json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    );
  }
}
