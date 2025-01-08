"use client"
import { useState, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import MenuItem from './MenuItem';
import Logo from './Logo';
import DoingIcon from './DoingIcon';
import Login from '../Login';
import Dialog from '../Common/Dialog';

interface NavigationProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeItem, onItemClick }) => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // 从localStorage获取用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // 只显示@之前的部分
      setUserEmail(user.email.split('@')[0]);
    }
  }, []);

  const handleProfileClick = () => {
    if (!userEmail) {
      setIsLoginOpen(true);
      onItemClick('profile');
    }
  };
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
  // 1秒后自动关闭对话框
  setTimeout(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, 1000);
};
const closeDialog = () => {
  setDialog(prev => ({ ...prev, isOpen: false }));
};
const handleLoginSuccess = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    setUserEmail(user.email.split('@')[0]);
  }
  showDialog('登录成功！', 'success');
};const handleLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  setUserEmail('');
  showDialog('已退出登录', 'info');
  setTimeout(() => {
    window.location.reload();
  }, 1500);
};
  const menuItems = [
    { id: 'box', icon: Logo, label: '一个盒子' },
    { id: 'generate', icon: DoingIcon, label: '一键生成' },
    // { id: 'design', icon: DesignStudioIcon, label: '设计工坊' },
  ];

  return (
    <>
      <nav className="h-full w-[70px] bg-[#1d1d1d] flex flex-col justify-between py-6 rounded-tr-[36px]">
        <div className="flex flex-col items-center space-y-6">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.id}
              onClick={() => onItemClick(item.id)}
            />
          ))}
        </div>
        <div className="mt-auto">
          <MenuItem
            icon={CgProfile}
            label={userEmail ? `${userEmail}` : '登录'}
            onClick={handleProfileClick}
            active={activeItem === 'profile'}
          />
          {userEmail && (
            <MenuItem
              icon={FiLogOut}
              label="退出登录"
              onClick={handleLogout}
              active={false}
            />
          )}
        </div>
      </nav>

     <>
       {/* 现有的导航栏代码 */}
       <Login 
         isOpen={isLoginOpen} 
         onClose={() => {
           setIsLoginOpen(false);
           onItemClick('box');
         }}
         onLoginSuccess={handleLoginSuccess}
       />
       <Dialog
         isOpen={dialog.isOpen}
         onClose={closeDialog}
         message={dialog.message}
         type={dialog.type}
        
       />
     </>
    </>
  );
}

export default Navigation;