import Image from 'next/image';

interface DoingIconProps {
  className?: string;
  active?: boolean;
}

export default function DoingIcon({ className = '', active }: DoingIconProps) {
  return (
    <div className={`w-8 h-8 relative ${className}`}>
      <Image
        src="/doing.svg"
        alt="Doing"
        fill
        className={`${active ? 'text-green-500' : 'text-gray-400'}`}
      />
    </div>
  );
}
