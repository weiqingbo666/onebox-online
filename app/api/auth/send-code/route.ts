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

    console.log('Received code request:', {
      email,
      type,
      timestamp: new Date().toISOString()
    });

    if (!email || !type) {
      return NextResponse.json(
        { error: '邮箱和类型不能为空' },
        { status: 400 }
      );
    }

    // 生成验证码
    const code = generateVerificationCode();
    console.log('Generated verification code:', {
      code,
      email,
      type,
      timestamp: new Date().toISOString()
    });

    try {
      // 保存验证码到数据库
      await Database.saveVerificationCode(email, code, type);
      console.log('Verification code saved to database');

      // 发送验证码邮件
      await sendVerificationEmail(email, code, type);
      console.log('Verification email sent successfully');

    } catch (error) {
      console.error('Error in code sending process:', {
        error,
        email,
        type,
        timestamp: new Date().toISOString()
      });



      return NextResponse.json(
        { error: '发送验证码失败，请重试' },
        { status: 500 }
      );
    }

    // 返回响应
    const response = {
      message: '验证码已发送',
      // 在开发环境或测试环境返回验证码
      code: process.env.NODE_ENV !== 'production' ? code : undefined,
      timestamp: new Date().toISOString()
    };

    console.log('Sending response:', {
      ...response,
      code: '***' // 日志中隐藏验证码
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in send-code route:', error);
    return NextResponse.json(
      { error: '发送验证码失败，请重试' },
      { status: 500 }
    );
  }
}
