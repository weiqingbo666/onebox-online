"use client"
import { useState } from 'react';
import Navigation from "@/components/LeftNavigation";
import Form from "@/components/Form";
import Classify from "@/components/Classify";
import RightNavigation from "@/components/RightNavigation";

const PROMPT_DESCRIPTIONS: { [key: number]: string } = {
  1: "水果印花飞机盒，矢量插图，白色背景，纸盒两侧有切割标记，底部边缘有两个标签，黄绿色调，下半部分由两个矩形组成，每个边缘都有棕色线条，左上角有三个设计，其中一个是连续的纸质线的小设计，正面有一个橙黄色条纹样的绿色梨子。",
  2: "图片显示竹子、波纹和亭子图案，使用淡灰蓝与暖米白的柔和渐变色，平面插画风格。",
  3: "图片显示零食、流动水滴图案，使用淡灰蓝与暖米白的柔和渐变色，现代极简风格。",
  4: "图片显示果园、采摘篮图案，淡灰蓝与暖米白的柔和渐变色，温暖治愈风格。",
  5: "图片显示家居用品、温馨生活、可爱动物图案，自然米色、柔和粉蓝的柔和渐变色，现代极简风格。",
  6: "图片显示家居用品、温馨生活图案，淡灰蓝、自然米色的柔和渐变色，实用美学风格。",
  7: "图片显示时尚服饰、时尚符号图案，复古牛仔蓝、象牙白、裸粉色的柔和渐变色，艺术拼贴风格。",
  8: "图片显示时尚服饰、时尚符号图案，经典黑白、复古牛仔蓝的柔和渐变色，艺术拼贴风格。",
  9: "图片显示衣架、织物纹理图案，清透蓝、金属银的柔和渐变色，动感活力风格。",
  10: "图片显示手袋轮廓图案，象牙白、裸粉色的柔和渐变色，复古怀旧风格。",
  11: "图片显示时尚服饰、时尚符号图案，莫兰迪色系的柔和渐变色，时尚大片风格。",
  12: "图片显示纽扣、拉链细节图案，清透蓝、金属银的柔和渐变色，都市时尚风格。",
  13: "图片显示云朵、卡通小动物、星星图案，浅蓝色、奶油白、温暖黄的柔和渐变色，自然手绘风格。",
  14: "图片显示爪印、小动物图案，清新绿、淡粉色的柔和渐变色，卡通可爱风格。",
  15: "图片显示爪印、小动物图案，浅蓝色、奶油白、温暖黄的柔和渐变色，自然温馨风格。",
  16: "图片显示云朵、小动物、星星图案，浅蓝色、奶油白、温暖黄的柔和渐变色，活泼趣味风格。",
  17: "图片显示小动物、自然植物图案，浅蓝色、奶油白、温暖黄的柔和渐变色，现代简约风格。",
  18: "图片显示童趣云朵、卡通小动物、可爱星星图案，浅蓝色、奶油白、温暖黄的柔和渐变色，剪纸风格。",
  19: "图片显示童趣云朵、卡通小动物、可爱星星图案，浅蓝色、奶油白、温暖黄的柔和渐变色，像素风格。",
  20: "图片显示时尚服饰、时尚符号图案，复古牛仔蓝、象牙白、裸粉色的柔和渐变色，像素风风格。",
  21: "图片显示时尚服饰、时尚符号图案，复古牛仔蓝、象牙白、裸粉色的柔和渐变色，剪纸风风格。",
  22: "图片显示家居用品、温馨生活、可爱动物图案，自然米色、柔和粉蓝的柔和渐变色，剪纸风风格。",
  23: "图片显示果园、采摘篮图案，清新绿色和奶油白的柔和渐变色，剪纸风风格。",
  24: "图片显示果园、采摘篮图案，清新绿色和奶油白的柔和渐变色，像素风风格。",
  25: "图片显示摇篮、奶瓶、花朵图案，柔粉色、浅蓝色和奶油白的柔和渐变色，温馨治愈风格。",
  26: "图片显示摇篮、奶瓶、花朵图案，柔粉色、浅蓝色和奶油白的柔和渐变色，像素风风格。",
  27: "图片显示时尚服饰、时尚符号图案，莫兰迪色系的柔和渐变色，时尚大片风格。",
  28: "图片显示云朵、星星、亲子玩耍图案，清新绿色和奶油白的柔和渐变色，简约柔和风格。",
  29: "图片显示烘焙食品图案，奶油白、自然棕的柔和渐变色，温暖治愈风格。",
  30: "图片显示绿植盆栽图案，奶油白、薄荷绿的柔和渐变色，优雅复古风格。"
};

export default function Home() {
  const [activeItem, setActiveItem] = useState('generate');
  const [currentGroup, setCurrentGroup] = useState(1);

  const handleGroupChange = (newGroup: number) => {
    setCurrentGroup(newGroup);
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="flex h-auto md:h-full w-full md:w-1/3 lg:w-1/4">
        <Navigation 
          activeItem={activeItem} 
          onItemClick={setActiveItem}
        />
        <div className="h-full pt-6" style={{ backgroundColor: '#fafde9' }}>
          <Classify />
        </div>
      </div>
      <div className="flex-1 p-4 md:p-0 overflow-y-auto md:overflow-visible">
        <div className="flex-1">
          <Form 
            currentGroup={currentGroup}
            onGroupChange={handleGroupChange}
          />
        </div>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-0 h-auto md:h-full">
        <RightNavigation 
          currentPrompt={PROMPT_DESCRIPTIONS[currentGroup]}
          currentGroup={currentGroup}
        />
      </div>
    </div>  
  );
}