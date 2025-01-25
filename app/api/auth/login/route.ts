import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Test database connection first
    const isConnected = await Database.testConnection();
    if (!isConnected) {
      console.error('Database connection failed');
      return NextResponse.json(
        { error: '服务器连接失败，请稍后重试' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, password, verificationCode, loginType } = body;
    
    console.log('Login attempt:', { 
      email,
      loginType,
      hasPassword: !!password,
      hasVerificationCode: !!verificationCode,
      timestamp: new Date().toISOString()
    });

    if (!email) {
      console.log('Login failed: Missing email');
      return NextResponse.json(
        { error: '邮箱不能为空' },
        { status: 400 }
      );
    }

    const user = await Database.findUserByEmail(email);
    console.log('User lookup result:', { 
      email, 
      userFound: !!user,
      timestamp: new Date().toISOString()
    });

    if (loginType === 'password') {
      if (!password) {
        console.log('Login failed: Missing password');
        return NextResponse.json(
          { error: '密码不能为空' },
          { status: 400 }
        );
      }

      if (!user || !await Database.verifyPassword(user, password)) {
        console.log('Login failed: Invalid credentials');
        return NextResponse.json(
          { error: '邮箱或密码错误' },
          { status: 401 }
        );
      }
    } else {
      if (!verificationCode) {
        console.log('Login failed: Missing verification code');
        return NextResponse.json(
          { error: '验证码不能为空' },
          { status: 400 }
        );
      }

      console.log('Verifying code:', {
        email,
        verificationCode,
        timestamp: new Date().toISOString()
      });

      const isValid = await Database.verifyCode(email, verificationCode, 'LOGIN');
      console.log('Code verification result:', {
        email,
        isValid,
        timestamp: new Date().toISOString()
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
        const newUser = await Database.createUser(email);
        const token = generateToken(newUser);
        return NextResponse.json({ user: newUser, token });
      }
    }

    const token = generateToken(user);
    console.log('Login successful:', { 
      email, 
      timestamp: new Date().toISOString() 
    });
    
    return NextResponse.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}
