import React, { useEffect, useRef } from 'react';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paper = document.createElement('div');
    paper.className = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 origin-center';
    
    // 包装纸折叠动画效果
    paper.innerHTML = `
      <div class="relative w-full h-full transform-style-3d animate-unfold">
        <!-- 主体 -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#c3f53b]/70 via-[#b5e48c]/30 to-transparent rounded-lg transform-style-3d animate-main-appear">
          <div class="absolute inset-0 bg-[linear-gradient(45deg,rgba(195,245,59,0.2)_0%,rgba(181,228,140,0.1)_100%)] animate-pulse"></div>
        </div>

        <!-- 四个折角 -->
        <div class="absolute top-0 left-0 w-1/2 h-1/2 origin-bottom-right transform-style-3d animate-corner-1">
          <div class="absolute inset-0 bg-[#c3f53b]/60 rounded-tl-lg"></div>
        </div>
        <div class="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left transform-style-3d animate-corner-2">
          <div class="absolute inset-0 bg-[#c3f53b]/60 rounded-tr-lg"></div>
        </div>
        <div class="absolute bottom-0 left-0 w-1/2 h-1/2 origin-top-right transform-style-3d animate-corner-3">
          <div class="absolute inset-0 bg-[#c3f53b]/60 rounded-bl-lg"></div>
        </div>
        <div class="absolute bottom-0 right-0 w-1/2 h-1/2 origin-top-left transform-style-3d animate-corner-4">
          <div class="absolute inset-0 bg-[#c3f53b]/60 rounded-br-lg"></div>
        </div>

        <!-- 装饰效果 -->
        <div class="absolute inset-0 overflow-hidden rounded-lg animate-decoration-appear">
          <div class="absolute inset-0 animate-scan bg-[linear-gradient(transparent_0%,rgba(195,245,59,0.15)_50%,transparent_100%)]"></div>
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(195,245,59,0.1)_0%,transparent_70%)] mix-blend-screen"></div>
        </div>

        <!-- 边缘光效 -->
        <div class="absolute inset-0 rounded-lg border border-[#b5e48c]/20 animate-glow">
          <div class="absolute top-1 left-1 w-2 h-2 bg-[#c3f53b]/80 rounded-full animate-blink"></div>
          <div class="absolute top-1 right-1 w-2 h-2 bg-[#c3f53b]/80 rounded-full animate-blink" style="animation-delay: 0.5s"></div>
        </div>
      </div>
    `;

    const container = containerRef.current;
    if (container) {
      container.appendChild(paper);
    }

    return () => {
      if (container && paper) {
        paper.remove();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] z-50">
      <style jsx global>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }

        @keyframes main-appear {
          0%, 100% {
            opacity: 0.8;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes corner-1 {
          0%, 100% {
            transform: rotateX(-360deg) rotateY(-360deg);
          }
          50% {
            transform: rotateX(-180deg) rotateY(-180deg);
          }
        }

        @keyframes corner-2 {
          0%, 100% {
            transform: rotateX(-360deg) rotateY(360deg);
          }
          50% {
            transform: rotateX(-180deg) rotateY(180deg);
          }
        }

        @keyframes corner-3 {
          0%, 100% {
            transform: rotateX(360deg) rotateY(-360deg);
          }
          50% {
            transform: rotateX(180deg) rotateY(-180deg);
          }
        }

        @keyframes corner-4 {
          0%, 100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
          50% {
            transform: rotateX(180deg) rotateY(180deg);
          }
        }

        @keyframes decoration-appear {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(195,245,59,0.1);
          }
          50% {
            box-shadow: 0 0 15px rgba(195,245,59,0.2);
          }
        }

        @keyframes unfold {
          0%, 100% {
            transform: perspective(1000px) rotateX(40deg) rotateY(40deg);
          }
          50% {
            transform: perspective(1000px) rotateX(50deg) rotateY(50deg);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .animate-main-appear {
          animation: main-appear 3s ease-in-out infinite;
        }

        .animate-corner-1 {
          animation: corner-1 4s ease-in-out infinite;
        }

        .animate-corner-2 {
          animation: corner-2 4s ease-in-out infinite;
        }

        .animate-corner-3 {
          animation: corner-3 4s ease-in-out infinite;
        }

        .animate-corner-4 {
          animation: corner-4 4s ease-in-out infinite;
        }

        .animate-decoration-appear {
          animation: decoration-appear 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        .animate-unfold {
          animation: unfold 4s ease-in-out infinite;
        }
      `}</style>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(195,245,59,0.03)_0%,transparent_70%)]" />
      
      <div ref={containerRef} className="relative w-[600px] h-[400px]">
        <div className="absolute inset-0 animate-spin-slow [transform-style:preserve-3d]">
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 border border-[#b5e48c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 border border-[#c3f53b]/5 rounded-full" />
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="text-lg font-medium text-[#86a061] text-center bg-white/30 px-6 py-2 rounded-full backdrop-blur-sm">
          AI正在生成您的专属设计
          <span className="inline-block ml-1">
            <span className="inline-block w-1 h-1 bg-[#c3f53b] rounded-full animate-blink"></span>
            <span className="inline-block w-1 h-1 bg-[#c3f53b] rounded-full animate-blink ml-0.5" style={{ animationDelay: '0.2s' }}></span>
            <span className="inline-block w-1 h-1 bg-[#c3f53b] rounded-full animate-blink ml-0.5" style={{ animationDelay: '0.4s' }}></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
