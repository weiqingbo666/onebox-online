"use client"

import { useState } from 'react';
import Image from 'next/image';

interface ClassifyItemProps {
  icon: string | JSX.Element;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function ClassifyItem({ icon, label, active, onClick }: ClassifyItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-2 px-2 py-2 rounded-lg cursor-pointer ${
        active ? 'bg-green-500/10 text-green-500' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-lg w-6 h-6 flex items-center justify-center">
        {typeof icon === 'string' ? icon : icon}
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export default function Classify() {
  const [activeItem, setActiveItem] = useState('包装设计');
  
  const menuItems = [
    { 
      icon: <Image src="/plan.svg" width={24} height={24} alt="包装设计" className={activeItem === '包装设计' ? 'text-green-500' : 'text-gray-700'} />,
      label: '包装设计' 
    },
   
  ];

  return (
    <div className="w-full max-w-[200px] rounded-2xl p-4 space-y-4" style={{ backgroundColor: '#fafde9' }}>
      <div className="flex items-center px-3 py-1.5 bg-black text-white text-sm font-medium rounded-full">
        <Image src="/add.svg" width={16} height={16} alt="add" className="mr-1" />
        更多包装类型
      </div>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <ClassifyItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.label}
            onClick={() => setActiveItem(item.label)}
          />
        ))}
      </div>
      <div className="pt-4 mt-4 border-t">
        <div className="text-xs font-semibold text-gray-800 mb-2">生成历史</div>
        <div className="space-y-2 text-xs text-gray-400">
          <div>水果印花飞机盒</div>
          <div>蓝色绸缎蝴蝶结礼物盒</div>
        </div>
      </div>
    </div>
  );
}