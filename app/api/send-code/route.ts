import { NextRequest, NextResponse } from 'next/server';
import { Database } from '../../../db/index';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();
    console.log('Request data:', { email, type });

    if (!email || !type || !['LOGIN', 'REGISTER'].includes(type)) {
      return NextResponse.json(
        { error: '邮箱和类型不能为空，类型必须是LOGIN或REGISTER' },
        { status: 400 }
      );
    }

    // 生成验证码
    const code = generateVerificationCode();
    console.log('Generated code:', code);

    // 保存验证码到数据库
    await Database.saveVerificationCode(email, code, type as 'LOGIN' | 'REGISTER');

    // TODO: 在这里集成实际的邮件发送服务
    console.log(`验证码 ${code} 已发送到邮箱 ${email}`);

    return NextResponse.json({
      message: '验证码已发送',
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
