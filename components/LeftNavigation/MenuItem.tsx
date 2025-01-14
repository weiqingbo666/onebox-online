import { IconType } from "react-icons";
import { ComponentType } from "react";

interface MenuItemProps {
  icon: IconType | ComponentType<{ active?: boolean }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function MenuItem({ icon: Icon, label, active, onClick }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center w-full p-2 cursor-pointer transition-all duration-200"
    >
      <div className={`flex flex-col items-center justify-center w-full ${
        active ? 'text-green-500 bg-white/10' : 'text-gray-400'
      } group-hover:text-green-500 group-hover:bg-white/15 p-2 rounded-lg`}>
        <Icon className="w-8 h-8 -mt-1" active={active ? true : undefined} />
        <span className="text-[8px] text-center">{label}</span>
      </div>
    </div>
  );
}