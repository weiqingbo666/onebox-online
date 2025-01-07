"use client"
import { useState } from 'react';
import Navigation from "@/components/LeftNavigation";
import Form from "@/components/Form";
import Classify from "@/components/Classify";
import RightNavigation from "@/components/RightNavigation";

export default function Home() {
  const [activeItem, setActiveItem] = useState('generate');

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
          <Form />
        </div>
        <div className="flex-1">
          {/* Other content goes here */}
        </div>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-0">
        <RightNavigation />
      </div>
    </div>  
  );
}