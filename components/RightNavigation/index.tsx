import React, { useState } from 'react';
import Image from 'next/image';
import Design from '../Design';

interface RightNavigationProps {
  currentPrompt: string;
  currentGroup: number;
}

const RightNavigation: React.FC<RightNavigationProps> = ({ currentPrompt, currentGroup }) => {
  const [isDesignOpen, setIsDesignOpen] = useState(false);

  return (
    <div className="h-auto md:h-screen flex items-center">
      <div className="flex flex-col w-full">
        <h2 className="text-lg font-bold mb-4 text-left">提示词和包装案例</h2>
        <div className="flex flex-col p-4 bg-[#fbfeed] rounded-2xl shadow-sm border-2 border-[#b5e48c] h-auto md:h-[calc(100vh-16rem)]">
          {/* Text section - scrollable */}
          <div className="h-[200px] md:h-[30%] mb-4">
            <div className="h-full p-4 bg-[#fffdf2] rounded-lg overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentPrompt}
              </p>
            </div>
          </div>
          
          {/* Image section - fixed height */}
          <div className="h-[250px] md:h-[45%] w-full p-4 bg-white rounded-lg shadow-sm mb-4">
            <div className="relative w-full h-full">
              <Image 
                src={`/${currentGroup}.png`}
                alt={`Plan ${currentGroup}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Button section - fixed at bottom  jwklad */}
          <div className="h-[150px] md:h-[25%] p-4 flex items-center">
            <button
              onClick={() => setIsDesignOpen(true)}
              className="w-full h-12 bg-[#b2ff3b] text-black rounded-[15px] hover:bg-[#99d363] shadow-sm flex items-center justify-center gap-2"
            >
              <div className="relative w-5 h-5">
                <Image 
                  src="/vector.svg" 
                  alt="Vector icon" 
                  fill
                  className="object-contain"
                />
              </div>
              自定义设计
            </button>
          </div>
        </div>

        <Design 
          isOpen={isDesignOpen} 
          onClose={() => setIsDesignOpen(false)} 
        />
      </div>
    </div>
  );
};

export default RightNavigation;