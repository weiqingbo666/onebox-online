import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import nodemailer from 'nodemailer';

// 创建邮件发送器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.qq.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email || !type || !['LOGIN', 'REGISTER'].includes(type)) {
      return NextResponse.json(
        { error: '参数错误' },
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

    // 如果是注册，检查邮箱是否已被注册
    if (type === 'REGISTER') {
      const existingUser = await db.findUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 400 }
        );
      }
    }

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 保存验证码
    await db.saveVerificationCode(email, code, type);

    // 发送验证码邮件
    await transporter.sendMail({
      from: `"Onebox 官方" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${type === 'REGISTER' ? '注册' : '登录'}验证码 - Onebox`,
      text: `您的${type === 'REGISTER' ? '注册' : '登录'}验证码是：${code}，10分钟内有效。`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://onebox.com/logo.png" alt="Onebox Logo" style="max-width: 150px; height: auto;" onerror="this.style.display='none'">
          </div>
          <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 30px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px; font-weight: 600;">欢迎使用 Onebox</h2>
            <p style="color: #4a4a4a; font-size: 16px; margin: 0 0 20px;">尊敬的用户：</p>
            <p style="color: #4a4a4a; font-size: 16px; margin: 0 0 20px;">
              您的${type === 'REGISTER' ? '注册' : '登录'}验证码是：
              <span style="color: #c3f53b; font-size: 24px; font-weight: 600; letter-spacing: 2px;">${code}</span>
            </p>
            <p style="color: #4a4a4a; font-size: 16px; margin: 0 0 20px;">
              验证码将在 10 分钟后失效，请尽快完成${type === 'REGISTER' ? '注册' : '登录'}。
            </p>
            <p style="color: #4a4a4a; font-size: 14px; margin: 30px 0 0;">
              如果这不是您的操作，请忽略此邮件。
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            <p style="margin: 0;">此邮件由系统自动发送，请勿回复</p>
            <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} Onebox. All rights reserved.</p>
          </div>
        </div>
      `
    });

    // 清理过期验证码
    await db.cleanupExpiredCodes();

    return NextResponse.json({ message: '验证码已发送' });

  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: '发送验证码失败，请重试' },
      { status: 500 }
    );
  }
}
