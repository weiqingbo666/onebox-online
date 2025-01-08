import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/db';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: '邮箱和类型不能为空' },
        { status: 400 }
      );
    }

    // 生成6位验证码
    const code = generateVerificationCode();

    // 保存验证码到数据库
    await Database.saveVerificationCode(email, code, type);

    // TODO: 在这里集成实际的邮件发送服务
    // 目前仅打印到控制台用于测试
    console.log(`验证码 ${code} 已发送到邮箱 ${email}`);

    return NextResponse.json({
      message: '验证码已发送',
      // 仅在开发环境返回验证码
      code: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: '发送验证码失败，请重试' },
      { status: 500 }
    );
  }
}
