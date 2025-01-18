"use client"

import { useState } from "react";
import CustomForm from "../Form";

export default function Main() {
  const [currentGroup, setCurrentGroup] = useState(1);

  return (
    <main className="flex-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <CustomForm 
          currentGroup={currentGroup}
          onGroupChange={setCurrentGroup}
        />
    </main>
  );
}