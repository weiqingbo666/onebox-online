import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Dialog from '../Common/Dialog';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginType, setLoginType] = useState<'password' | 'sms'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    message: string;
    type: 'info' | 'error' | 'warning' | 'success';
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showDialog = (message: string, type: 'info' | 'error' | 'warning' | 'success' = 'info') => {
    setDialog({ isOpen: true, message, type });
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const startCountdown = useCallback(() => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendCode = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showDialog('请输入正确的邮箱地址', 'warning');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: isRegistering ? 'REGISTER' : 'LOGIN'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '发送验证码失败');
      }

      showDialog('验证码已发送到您的邮箱', 'success');
      startCountdown();
    } catch (error) {
      console.error('Failed to send verification code:', error);
      showDialog(error instanceof Error ? error.message : '发送验证码失败，请重试', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      showDialog('请先同意用户协议和隐私政策', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          verificationCode,
          loginType,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }
      
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      document.dispatchEvent(new Event('login-success'));
      
      onLoginSuccess?.();
    
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
      showDialog(error instanceof Error ? error.message : '登录失败，请重试', 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showDialog('请输入正确的邮箱地址', 'warning');
      return;
    }

    if (!verificationCode) {
      showDialog('请输入验证码', 'warning');
      return;
    }

    if (!password) {
      showDialog('请输入密码', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showDialog('两次输入的密码不一致', 'warning');
      return;
    }

    if (!agreedToTerms) {
      showDialog('请先同意用户协议和隐私政策', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          verificationCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }

      showDialog('注册成功！', 'success');
      setTimeout(() => {
        setIsRegistering(false);
        // 清空表单
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setVerificationCode('');
        setAgreedToTerms(false);
      }, 1500);
    } catch (error) {
      console.error('Registration failed:', error);
      showDialog(error instanceof Error ? error.message : '注册失败，请重试', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* 内容区域 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div 
          className={`bg-white rounded-2xl shadow-xl w-[1000px] overflow-hidden transition-all duration-200 ${isOpen ? 'scale-100' : 'scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl overflow-hidden flex relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left side - Image */}
            <div className="w-1/2 bg-[#f8faf0] flex items-center justify-center p-8">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/login.svg"
                  alt="Login"
                  width={320}
                  height={384}
                  className="object-contain max-w-full max-h-full"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
            </div>

            {/* Right side - Login/Register Form */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="w-96 p-8">
                {!isRegistering ? (
                  <>
                    <div className="flex gap-4 mb-8">
                      <button
                        className={`text-xl font-medium ${loginType === 'password' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setLoginType('password')}
                      >
                        密码登录
                      </button>
                      <button
                        className={`text-xl font-medium ${loginType === 'sms' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setLoginType('sms')}
                      >
                        验证码登录
                      </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                      {/* Email Input */}
                      <div className="relative">
                        <div className="flex border rounded-full overflow-hidden">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="输入邮箱"
                            className="flex-1 px-4 py-3 outline-none"
                          />
                        </div>
                      </div>

                      {/* Password or Verification Code Input */}
                      <div className="relative">
                        <div className="flex border rounded-full overflow-hidden">
                          <input
                            type={loginType === 'password' ? (showPassword ? "text" : "password") : "text"}
                            value={loginType === 'password' ? password : verificationCode}
                            onChange={(e) => loginType === 'password' 
                              ? setPassword(e.target.value)
                              : setVerificationCode(e.target.value)
                            }
                            placeholder={loginType === 'password' ? "输入密码" : "输入验证码"}
                            className="flex-1 px-4 py-3 outline-none"
                            maxLength={loginType === 'password' ? undefined : 9}
                          />
                          {loginType === 'password' ? (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="px-4"
                            >
                              <Image
                                src="/vector.svg"
                                alt={showPassword ? "Hide password" : "Show password"}
                                width={20}
                                height={20}
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendCode}
                              disabled={countdown > 0}
                              className={`px-4 whitespace-nowrap ${countdown > 0 ? 'text-gray-400' : 'text-green-500'}`}
                            >
                              {countdown > 0 ? `${countdown}s后重新发送` : '发送验证码'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600">
                          我已阅读并同意{' '}
                          <a href="#" className="text-green-500">用户协议</a>
                          {' '}和{' '}
                          <a href="#" className="text-green-500">隐私政策</a>
                        </span>
                      </div>

                      {/* Login Button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#c3f53b] rounded-full text-black font-medium hover:bg-[#b5e48c] transition-colors"
                      >
                        登录
                      </button>

                      {/* Register Link */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setIsRegistering(true)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          还没注册？前往注册 &gt;
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-medium mb-8">注册账号</div>
                    <form onSubmit={handleRegister} className="space-y-6">
                      {/* Email Input */}
                      <div className="relative">
                        <div className="flex border rounded-full overflow-hidden">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="输入邮箱"
                            className="flex-1 px-4 py-3 outline-none"
                          />
                        </div>
                      </div>

                      {/* Verification Code Input */}
                      <div className="relative">
                        <div className="flex border rounded-full overflow-hidden">
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="输入验证码"
                            className="flex-1 px-4 py-3 outline-none"
                            maxLength={9}
                          />
                          <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={countdown > 0}
                            className={`px-4 whitespace-nowrap ${countdown > 0 ? 'text-gray-400' : 'text-green-500'}`}
                          >
                            {countdown > 0 ? `${countdown}s后重新发送` : '发送验证码'}
                          </button>
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="relative">
                        <div className="flex border rounded-full overflow-hidden">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="设置密码"
                            className="flex-1 px-4 py-3 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-4"
                          >
                            <Image
                              src="/vector.svg"
                              alt={showPassword ? "Hide password" : "Show password"}
                              width={20}
                              height={20}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password Input */}
                      <div className="relative">
                        <div className="flex border rounded-full overflow-hidden">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="确认密码"
                            className="flex-1 px-4 py-3 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="px-4"
                          >
                            <Image
                              src="/vector.svg"
                              alt={showConfirmPassword ? "Hide password" : "Show password"}
                              width={20}
                              height={20}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600">
                          我已阅读并同意{' '}
                          <a href="#" className="text-green-500">用户协议</a>
                          {' '}和{' '}
                          <a href="#" className="text-green-500">隐私政策</a>
                        </span>
                      </div>

                      {/* Register Button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#c3f53b] rounded-full text-black font-medium hover:bg-[#b5e48c] transition-colors"
                      >
                        注册
                      </button>

                      {/* Login Link */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setIsRegistering(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          已有账号？去登录 &gt;
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        message={dialog.message}
        type={dialog.type}
        confirmText="确定"
        autoCloseDelay={1000} // 5 seconds
      />
    </>
  );
};

export default Login;