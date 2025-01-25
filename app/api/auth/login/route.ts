import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, verificationCode, loginType } = await request.json();

    console.log('Login attempt:', { 
      email, 
      loginType, 
      hasPassword: !!password,
      hasVerificationCode: !!verificationCode,
      timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    });

    if (!email) {
      return NextResponse.json(
        { error: '邮箱不能为空' },
        { status: 400 }
      );
    }

    const user = await Database.findUserByEmail(email);
    console.log('User lookup result:', { 
      email, 
      userFound: !!user,
      timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    });

    if (loginType === 'password') {
      if (!password) {
        return NextResponse.json(
          { error: '密码不能为空' },
          { status: 400 }
        );
      }

      if (!user) {
        console.log('Login failed: User not found');
        return NextResponse.json(
          { error: '邮箱或密码错误' },
          { status: 401 }
        );
      }

      const isValidPassword = await Database.verifyPassword(user, password);
      console.log('Password verification:', {
        email,
        isValid: isValidPassword,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      if (!isValidPassword) {
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

      console.log('Verifying code:', {
        email,
        code: verificationCode,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      const isValid = await Database.verifyCode(email, verificationCode, 'LOGIN');
      console.log('Code verification result:', {
        email,
        isValid,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });

      if (!isValid) {
        return NextResponse.json(
          { error: '验证码无效或已过期' },
          { status: 401 }
        );
      }

      // 如果用户不存在，为验证码登录创建一个新用户
      if (!user) {
        console.log('Creating new user for verification code login:', { email });
        try {
          const newUser = await Database.createUser(email);
          const token = generateToken(newUser);
          console.log('New user created successfully:', { 
            email,
            userId: newUser.id,
            timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
          });
          return NextResponse.json({ user: newUser, token });
        } catch (error) {
          console.error('Failed to create new user:', error);
          return NextResponse.json(
            { error: '创建用户失败，请重试' },
            { status: 500 }
          );
        }
      }
    }

    const token = generateToken(user);
    console.log('Login successful:', { 
      email,
      userId: user.id,
      timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    });
    
    return NextResponse.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    // 检查是否是数据库连接错误
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { error: '服务器连接失败，请稍后重试' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}
