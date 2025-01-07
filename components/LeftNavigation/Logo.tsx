import Image from 'next/image';

interface LogoProps {
  className?: string;
  active?: boolean;
}

export default function Logo({ className = '', active }: LogoProps) {
  return (
    <div className={`w-8 h-8 relative ${className}`}>
      <Image
        src="/logo.svg"
        alt="Logo"
        fill
        className={`${active ? 'text-green-500' : 'text-gray-400'}`}
      />
    </div>
  );
}
