import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/db';
import { sendVerificationEmail } from '@/utils/email';

function generateVerificationCode(): string {
  // 生成4位数字验证码
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
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

    // 生成验证码
    const code = generateVerificationCode();

    // 保存验证码到数据库
    await Database.saveVerificationCode(email, code, type);

    try {
      // 发送验证码邮件
      await sendVerificationEmail(email, code, type);
    } catch (emailError) {
      console.error('Send email error:', emailError);
      return NextResponse.json(
        { error: '发送验证码邮件失败，请检查邮箱地址是否正确' },
        { status: 500 }
      );
    }

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
