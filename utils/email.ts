import nodemailer from 'nodemailer';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: '979017602@qq.com',
    pass: 'wjdrnmpeufppbfge',
  },
});

export async function sendVerificationEmail(to: string, code: string, type: string) {
  const typeText = type === 'register' ? '注册' : '登录';
  
  // 邮件HTML模板
  const htmlTemplate = `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
      color: #333;
    ">
      <div style="
        background: linear-gradient(135deg, #edf5cd 0%, #a3baae 100%);
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
      ">
        <h1 style="
          color: #000;
          margin: 0;
          font-size: 24px;
          text-align: center;
        ">OneBox 验证码</h1>
      </div>
      
      <div style="
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <p style="margin-bottom: 20px;">尊敬的用户：</p>
        <p style="margin-bottom: 20px;">
          您正在进行 OneBox ${typeText}操作，您的验证码为：
        </p>
        <div style="
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        ">
          <span style="
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #000;
            font-family: monospace;
          ">${code}</span>
        </div>
        <p style="
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        ">
          验证码有效期为5分钟，请勿向他人泄露。若非本人操作，请忽略此邮件。
        </p>
      </div>
      
      <div style="
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #666;
      ">
        <p>此为系统自动发送邮件，请勿回复</p>
        <p>© ${new Date().getFullYear()} OneBox</p>
      </div>
    </div>
  `;

  // 发送邮件
  const info = await transporter.sendMail({
    from: '"OneBox" <979017602@qq.com>', // 发件人必须与授权的QQ邮箱一致
    to: to,
    subject: `OneBox ${typeText}验证码`,
    html: htmlTemplate,
  });

  return info;
}
