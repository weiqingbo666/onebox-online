import React from 'react';

const DateComponent: React.FC = () => {
  const formattedDate = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="text-gray-600">
      {formattedDate}
    </div>
  );
};

export default DateComponent;