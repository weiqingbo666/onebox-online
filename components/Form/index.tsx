"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import ImageModal from '@/components/ImageModal';

interface DesignImageProps {
  src: string;
  alt: string;
  index: number;
}

const DesignImage: React.FC<DesignImageProps> = ({ src, alt, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="w-64 h-64 bg-[#fbfeed] cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={src}
          alt={alt}
          width={256}
          height={256}
          className="w-full h-full object-cover"
          priority={index < 2}
        />
      </div>

      <ImageModal
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

interface FormProps {
  currentGroup: number;
  onGroupChange: (newGroup: number) => void;
}

export default function CustomForm({ currentGroup, onGroupChange }: FormProps) {
  const [images, setImages] = useState([
    { src: `/1_a.png`, alt: 'Design Image 1' },
    { src: `/1_b.png`, alt: 'Design Image 2' },
    { src: `/1_c.png`, alt: 'Design Image 3' },
    { src: `/1_d.png`, alt: 'Design Image 4' },
  ]);

  const getRandomGroup = (current: number): number => {
    const available = Array.from({length: 30}, (_, i) => i + 1).filter(num => num !== current);
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleGenerateClick = () => {
    const nextGroup = getRandomGroup(currentGroup);
    onGroupChange(nextGroup);
    setImages([
      { src: `/${nextGroup}_a.png`, alt: 'Design Image 1' },
      { src: `/${nextGroup}_b.png`, alt: 'Design Image 2' },
      { src: `/${nextGroup}_c.png`, alt: 'Design Image 3' },
      { src: `/${nextGroup}_d.png`, alt: 'Design Image 4' },
    ]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header with Avatar and Message */}
          <div className="max-w-2xl">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <div className="w-16 sm:w-23 h-16 sm:h-23 rounded-full overflow-hidden bg-black flex items-center justify-center">
                <Image src="/plan.svg" alt="Gift Icon" width={80} height={80} className="scale-75 sm:scale-100" />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="font-bold mb-1 text-2xl sm:text-4xl">👋我是你的包装设计助手</div>
                  <div className="flex items-center font-bold">
                    <span className="text-2xl sm:text-4xl">我们现在来一键生成设计图吧</span>
                    <span className="ml-1 text-xl sm:text-3xl">🚀</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="bg-[#fbfeed] rounded-2xl overflow-hidden w-full sm:w-[512px] h-[512px]">
            <div className="grid grid-cols-2 w-full h-full">
              {images.map((image, index) => (
                <DesignImage 
                  key={image.src}
                  {...image}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
         
      <div className="p-6 border-t bg-white">
        <div className="flex justify-center">
          <button 
            onClick={handleGenerateClick}
            className="bg-[#b2ff3b] text-black font-semibold px-6 py-2 rounded-[15px] flex items-center space-x-2"
          >
            <Image src="/lightning.svg" alt="Lightning" width={20} height={20} />
            <span>一键生成</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
