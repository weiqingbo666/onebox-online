import React, { useState, useEffect } from 'react';

import { Button } from 'antd';

import Dialog from '../Common/Dialog';

import LoadingAnimation from './LoadingAnimation';

interface DesignProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DesignConfig {
  productType: string;
  element: string;
  style: string;
  color: string;
}

interface CategoryOptions {
  elements: string[];
  styles: string[];
  colors: string[];
}

const categoryOptionsMap: Record<string, CategoryOptions> = {
  '食品饮品': {
    elements: ['采摘篮', '果园', '流动水滴', '零食', '烘焙食品'],
    styles: ['现代极简', '简约田园', '温暖治愈', '像素风', '剪纸风'],
    colors: ['清新绿', '温暖黄', '奶油白', '清透蓝', '活力橙']
  },
  '生活百货': {
    elements: ['家居用品', '可爱动物', '温馨生活', '竹子', '亭子'],
    styles: ['平面插画', '现代极简', '实用美学', '剪纸风'],
    colors: ['淡灰蓝', '暖米白', '柔和粉蓝', '明亮黄', '清新绿']
  },
  '服装鞋包': {
    elements: ['时尚服饰', '时尚符号', '衣架', '织物纹理', '手袋轮廓'],
    styles: ['艺术拼贴', '动感活力', '复古怀旧', '像素风', '剪纸风', '时尚大片'],
    colors: ['牛仔蓝', '象牙白', '裸粉色', '经典黑白', '莫兰迪色系']
  },
  '宠物用品': {
    elements: ['童趣云朵', '小动物', '可爱星星', '爪印', '自然植物'],
    styles: ['自然手绘', '卡通可爱', '活泼趣味', '现代简约', '像素风', '剪纸风'],
    colors: ['浅蓝色', '奶油白', '温暖黄', '清新绿', '淡粉色']
  },
  '母婴亲子': {
    elements: ['摇篮', '奶瓶', '花朵', '云朵', '星星', '亲子玩耍'],
    styles: ['温馨治愈', '像素风', '剪纸风', '简约柔和'],
    colors: ['柔粉色', '浅蓝色', '奶油白', '薄荷绿', '柔和米黄']
  }
};

const Design: React.FC<DesignProps> = ({ isOpen, onClose }) => {
  const [designConfig, setDesignConfig] = useState<DesignConfig>({
    productType: '食品饮品',
    element: '',
    style: '',
    color: ''
  });

  const [showInput, setShowInput] = useState(false);
  const [inputType, setInputType] = useState<'element' | 'style' | 'color' | null>(null);
  const [customInputs, setCustomInputs] = useState({
    element: '',
    style: '',
    color: ''
  });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    message: string;
    type: 'info' | 'error' | 'warning' | 'success';
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  useEffect(() => {
    if (taskId) {
      const interval = setInterval(() => {
        if (!mounted) return;
        checkTaskStatus(taskId);
      }, 2000);
      setPollingInterval(interval);
      return () => {
        clearInterval(interval);
        setPollingInterval(null);
      };
    }
  }, [taskId, mounted]);

  const currentOptions = designConfig.productType ? categoryOptionsMap[designConfig.productType] : {
    elements: [],
    styles: [],
    colors: []
  };

  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/check-task-status?taskId=${taskId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      if (data.status === 'SUCCEEDED' && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setLoading(false);
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      } else if (data.status === 'FAILED') {
        throw new Error('生成图片失败');
      }
      // Continue polling for PENDING or RUNNING status
    } catch (error) {
      showDialog('检查任务状态时出错，请稍后重试'+error);
    }
  };

  const handleProductTypeChange = (type: string) => {
    setDesignConfig(prev => ({ 
      ...prev, 
      productType: type,
      element: '',
      style: '',
      color: ''
    }));
    setCustomInputs({
      element: '',
      style: '',
      color: ''
    });
  };

  const handleOptionSelect = (type: 'element' | 'style' | 'color', value: string) => {
    setDesignConfig(prev => ({ ...prev, [type]: value }));
  };

  const handleInputClick = (type: 'element' | 'style' | 'color') => {
    setInputType(type);
    setShowInput(true);
    setInputText(customInputs[type]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputSubmit = () => {
    if (inputType && inputText.trim()) {
      setCustomInputs(prev => ({
        ...prev,
        [inputType]: inputText.trim()
      }));
      setDesignConfig(prev => ({ ...prev, [inputType]: '自定义' }));
    }
    setShowInput(false);
    setInputType(null);
    setInputText('');
  };

  const handleGenerate = async () => {
    if (!designConfig.productType || !designConfig.element || !designConfig.style || !designConfig.color) {
      showDialog('请完成所有选项的选择', 'warning');
      return;
    }

    setLoading(true);
    setGeneratedImage('');
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    try {
      const elementText = customInputs.element ? `${designConfig.element}和${customInputs.element}` : designConfig.element;
      const styleText = customInputs.style ? `${designConfig.style}和${customInputs.style}` : designConfig.style;
      const colorText = customInputs.color ? `${designConfig.color}和${customInputs.color}` : designConfig.color;
      
      const prompt = `为${designConfig.productType}设计一个包装纸，包含${elementText}元素，采用${styleText}风格，主色调为${colorText}。商业摄影品质，电影级光照，锐利的边缘。`;

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!data.success || !data.taskId) {
        throw new Error(data.error || '创建任务失败');
      }

      setTaskId(data.taskId);
      
      // Start polling for task status
      const interval = setInterval(() => {
        checkTaskStatus(data.taskId);
      }, 2000); // Poll every 2 seconds
      
      setPollingInterval(interval);
    } catch (error) {
      showDialog('生成图片时出错，请稍后重试'+error);
    }
  };

  const showDialog = (message: string, type: 'info' | 'error' | 'warning' | 'success' = 'info') => {
    setDialog({ isOpen: true, message, type });
    setTimeout(() => {
      setDialog(prev => ({ ...prev, isOpen: false }));
    }, 1000);
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="absolute inset-y-0 right-[0px] left-[230px] bg-gradient-to-br from-[#edf5cd] to-[#a3baae] flex items-center justify-center z-40"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl w-[800px] min-h-[600px] relative p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button          onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-medium">
              {generatedImage ? '设计完成' : '你的设计信息'}
            </h2>
          </div>

          {!generatedImage ? (
            <div className="flex gap-8">
              {/* Left Side - Preview */}
              <div className="w-1/3 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">产品类型</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(categoryOptionsMap).map((type) => (
                      <button 
                        key={type}
                        className={`px-4 py-3 rounded-xl text-sm text-center transition-all duration-200 hover:shadow-md ${
                          designConfig.productType === type ? 'bg-[#e8ffd6] shadow-sm' : 'bg-white border hover:border-[#e8ffd6]'
                        }`}
                        onClick={() => handleProductTypeChange(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Chat */}
              <div className="w-2/3 bg-[#f8faf0] rounded-lg p-4 min-h-[500px]">
                {/* AI Message */}
                <div className="flex gap-2 mb-4 animate-fadeIn">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                    <img
                      src="/logo.svg"
                      alt="AI"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-4">Hi👋, 我是你的包装设计AI助手，请回答以下问题，让我帮你完成自定义设计。</p>
                  </div>
                </div>

                {/* Design Options */}
                <div className="space-y-6">
                  {/* Elements */}
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm mb-2">选择包装元素：</p>
                    <div className="flex flex-wrap gap-2">
                      {currentOptions.elements.map((element, index) => (
                        <button
                          key={`${designConfig.productType}-${element}`}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:shadow-sm animate-slideIn ${
                            designConfig.element === element ? 'bg-[#e8ffd6]' : 'bg-white border hover:border-[#e8ffd6] hover:scale-105'
                          }`}
                          style={{ animationDelay: `${index * 25}ms` }}
                          onClick={() => handleOptionSelect('element', element)}
                        >
                          {element}
                        </button>
                      ))}
                      <button
                        key={`${designConfig.productType}-element-custom`}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:shadow-sm animate-slideIn ${
                          designConfig.element === '自定义' ? 'bg-[#e8ffd6]' : 'bg-white border hover:border-[#e8ffd6] hover:scale-105'
                        }`}
                        style={{ animationDelay: `${currentOptions.elements.length * 25}ms` }}
                        onClick={() => handleInputClick('element')}
                      >
                        {designConfig.element === '自定义' ? customInputs.element : '自定义（请输入）'}
                      </button>
                    </div>
                  </div>

                  {/* Styles */}
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm mb-2">选择设计风格：</p>
                    <div className="flex flex-wrap gap-2">
                      {currentOptions.styles.map((style, index) => (
                        <button
                          key={`${designConfig.productType}-${style}`}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:shadow-sm animate-slideIn ${
                            designConfig.style === style ? 'bg-[#e8ffd6]' : 'bg-white border hover:border-[#e8ffd6] hover:scale-105'
                          }`}
                          style={{ animationDelay: `${index * 25}ms` }}
                          onClick={() => handleOptionSelect('style', style)}
                        >
                          {style}
                        </button>
                      ))}
                      <button
                        key={`${designConfig.productType}-style-custom`}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:shadow-sm animate-slideIn ${
                          designConfig.style === '自定义' ? 'bg-[#e8ffd6]' : 'bg-white border hover:border-[#e8ffd6] hover:scale-105'
                        }`}
                        style={{ animationDelay: `${currentOptions.styles.length * 25}ms` }}
                        onClick={() => handleInputClick('style')}
                      >
                        {designConfig.style === '自定义' ? customInputs.style : '自定义（请输入）'}
                      </button>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm mb-2">选择颜色：</p>
                    <div className="flex flex-wrap gap-2">
                      {currentOptions.colors.map((color, index) => (
                        <button
                          key={`${designConfig.productType}-${color}`}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:shadow-sm animate-slideIn ${
                            designConfig.color === color ? 'bg-[#e8ffd6]' : 'bg-white border hover:border-[#e8ffd6] hover:scale-105'
                          }`}
                          style={{ animationDelay: `${index * 25}ms` }}
                          onClick={() => handleOptionSelect('color', color)}
                        >
                          {color}
                        </button>
                      ))}
                      <button
                        key={`${designConfig.productType}-color-custom`}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:shadow-sm animate-slideIn ${
                          designConfig.color === '自定义' ? 'bg-[#e8ffd6]' : 'bg-white border hover:border-[#e8ffd6] hover:scale-105'
                        }`}
                        style={{ animationDelay: `${currentOptions.colors.length * 25}ms` }}
                        onClick={() => handleInputClick('color')}
                      >
                        {designConfig.color === '自定义' ? customInputs.color : '自定义（请输入）'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                {showInput && (
                  <div className="relative mt-4">
                    <input
                      type="text"
                      value={inputText}
                      onChange={handleInputChange}
                      placeholder={`请输入自定义${inputType === 'element' ? '元素' : inputType === 'style' ? '风格' : '颜色'}...`}
                      className="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:border-[#e8ffd6] focus:ring-1 focus:ring-[#e8ffd6] transition-colors duration-200"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleInputSubmit();
                        }
                      }}
                    />
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                      onClick={handleInputSubmit}
                    >
                      <svg className="w-6 h-6 text-gray-400 transition-colors duration-200 hover:text-[#e8ffd6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full max-w-xl rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={generatedImage} 
                  alt="Generated design" 
                  className="w-full h-auto"
                  onError={(error) => {
                    console.error('Image failed to load'+error);
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">生成的设计图片</p>
                    <div className="flex gap-3">
                      <Button 
                        type="primary"
                        className="!bg-[#c3f53b] !text-black hover:!bg-[#b5e48c] border-none"
                        size="small"
                        onClick={() => window.open(generatedImage, '_blank')}
                      >
                        查看原图
                      </Button>
                      <Button 
                        className="!bg-white/80 hover:!bg-white/90 !text-black border-none"
                        size="small"
                        onClick={() => {
                          setGeneratedImage('');
                          setLoading(false);
                        }}
                      >
                        重新设计
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button and Loading State */}
          {!generatedImage && (
            <>
              <div className="mt-6 flex flex-col items-center">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className={`w-40 h-10 text-base font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading 
                      ? 'opacity-0'
                      : 'bg-[#c3f53b] text-black hover:bg-[#b5e48c] hover:shadow-md active:scale-95'
                  }`}
                >
                  生成设计
                </Button>
              </div>
              {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm z-50">
                  <LoadingAnimation />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        message={dialog.message}
        type={dialog.type}
      />
    </>
  );
};

export default Design;