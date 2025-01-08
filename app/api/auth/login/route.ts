import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, verificationCode, loginType } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: '邮箱不能为空' },
        { status: 400 }
      );
    }

    const user = await Database.findUserByEmail(email);

    if (loginType === 'password') {
      if (!password) {
        return NextResponse.json(
          { error: '密码不能为空' },
          { status: 400 }
        );
      }

      if (!user || !await Database.verifyPassword(user, password)) {
        return NextResponse.json(
          { error: '邮箱或密码错误' },
          { status: 401 }
        );
      }
    } else {
      if (!verificationCode) {
        return NextResponse.json(
          { error: '验证码不能为空' },
          { status: 400 }
        );
      }

      const isValid = await Database.verifyCode(email, verificationCode, 'LOGIN');
      if (!isValid) {
        return NextResponse.json(
          { error: '验证码无效或已过期' },
          { status: 401 }
        );
      }

      // 如果用户不存在，为验证码登录创建一个新用户
      if (!user) {
        const newUser = await Database.createUser(email);
        const token = generateToken(newUser);
        return NextResponse.json({ user: newUser, token });
      }
    }

    const token = generateToken(user);
    return NextResponse.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}
