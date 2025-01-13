import React, { useState } from 'react';
import Image from 'next/image';
import Design from '../Design';

const RightNavigation: React.FC = () => {
  const [isDesignOpen, setIsDesignOpen] = useState(false);

  return (
    <>
      <h2 className="text-lg font-bold mb-4 text-center">提示词和包装案例</h2>
      <div className="flex flex-col p-4 bg-[#fbfeed] rounded-2xl shadow-sm border-2 border-[#b5e48c]">
        <div className="mb-4 p-4 bg-[#fffdf2] rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            水果印花飞机盒，矢量插图，白色背景，纸盒两侧有切割标记，底部边缘有两个标签，黄绿色调，下半部分由两个矩形组成，每个边缘都有棕色线条，左上角有三个设计，其中一个是连续的纸质线的小设计，正面有一个橙黄色条纹样的绿色梨子。
          </p>
        </div>
        <div className="w-full p-4 bg-white rounded-lg shadow-sm mb-4">
          <Image 
            src="/planleft.svg" 
            alt="Plan Left"
            className="w-full object-contain"
          />
        </div>
        <div className="p-4">
          <button
            onClick={() => setIsDesignOpen(true)}
            className="w-full h-12 bg-[#b5e48c] text-black rounded-full hover:bg-[#99d363] shadow-sm flex items-center justify-center gap-2"
          >
            <Image src="/vector.svg" alt="Vector icon" className="w-5 h-5" />
            自定义设计
          </button>
        </div>
      </div>

      <Design 
        isOpen={isDesignOpen} 
        onClose={() => setIsDesignOpen(false)} 
      />
    </>
  );
};

export default RightNavigation;