"use client"
import { useState } from 'react';
import Navigation from "@/components/LeftNavigation";
import Form from "@/components/Form";
import Classify from "@/components/Classify";
import RightNavigation from "@/components/RightNavigation";

const PROMPT_DESCRIPTIONS = {
  1: "水果印花飞机盒，矢量插图，白色背景，纸盒两侧有切割标记，底部边缘有两个标签，黄绿色调，下半部分由两个矩形组成，每个边缘都有棕色线条，左上角有三个设计，其中一个是连续的纸质线的小设计，正面有一个橙黄色条纹样的绿色梨子。",
  2: "图片显示竹子、波纹和亭子图案，使用淡灰蓝与暖米白的柔和渐变色，采用平面插画风格。",
  3: "图片显示零食、流动水滴图案，使用淡灰蓝与暖米白的柔和渐变色，采用现代极简风格。",
  4: "图片显示果园、采摘篮图案，淡灰蓝与暖米白的柔和渐变色，温暖治愈风格",
  5: "图片显示家居用品、温馨生活、可爱动物图案，自然米色、柔和粉蓝的柔和渐变色，现代极简风格",
  6: "图片显示家居用品、温馨生活图案淡灰蓝、自然米色的柔和渐变色，实用美。"
};

export default function Home() {
  const [activeItem, setActiveItem] = useState('generate');
  const [currentGroup, setCurrentGroup] = useState(1);

  const handleGroupChange = (newGroup: number) => {
    setCurrentGroup(newGroup);
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="flex h-full md:w-1/3 lg:w-1/4">
        <Navigation 
          activeItem={activeItem} 
          onItemClick={setActiveItem}
        />
        <div className="h-full pt-6" style={{ backgroundColor: '#fafde9' }}>
          <Classify />
        </div>
      </div>
      <div className="flex-1 p-4 md:p-0">
        <div className="flex-1">
          <Form 
            currentGroup={currentGroup}
            onGroupChange={handleGroupChange}
          />
        </div>
        <div className="flex-1">
          {/* Other content goes here */}
        </div>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-0">
        <RightNavigation 
          currentPrompt={PROMPT_DESCRIPTIONS[currentGroup]}
        />
      </div>
    </div>  
  );
}