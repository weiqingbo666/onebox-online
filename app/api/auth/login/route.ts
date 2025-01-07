import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email, password, verificationCode, loginType } = await req.json();

    if (!email || (!password && !verificationCode) || !loginType) {
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

    // 获取用户信息
    const user = await db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 400 }
      );
    }

    let isValidLogin = false;

    if (loginType === 'password') {
      // 密码登录
      if (!password) {
        return NextResponse.json(
          { error: '请输入密码' },
          { status: 400 }
        );
      }

      isValidLogin = await db.verifyPassword(user, password);
      if (!isValidLogin) {
        return NextResponse.json(
          { error: '密码错误' },
          { status: 400 }
        );
      }
    } else {
      // 验证码登录
      if (!verificationCode) {
        return NextResponse.json(
          { error: '请输入验证码' },
          { status: 400 }
        );
      }

      isValidLogin = await db.verifyCode(email, verificationCode, 'LOGIN');
      if (!isValidLogin) {
        return NextResponse.json(
          { error: '验证码无效或已过期' },
          { status: 400 }
        );
      }
    }

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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}
