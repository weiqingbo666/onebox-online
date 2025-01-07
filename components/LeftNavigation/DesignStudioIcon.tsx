import Image from 'next/image';

interface DesignStudioIconProps {
  className?: string;
  active?: boolean;
}

export default function DesignStudioIcon({ className = '', active }: DesignStudioIconProps) {
  return (
    <div className={`w-8 h-8 relative ${className}`}>
      <Image
        src="/DesignStudio.svg"
        alt="Design Studio"
        fill
        className={`${active ? 'text-green-500' : 'text-gray-400'}`}
      />
    </div>
  );
}
