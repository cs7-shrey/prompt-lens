import Image from 'next/image';
import { useState } from 'react';

export default function BrandLogo({ domain, name, size = 48 }: { domain?: string | null, name: string, size: number }) {
  const [error, setError] = useState(false);
  
  if (error || !domain || !domain.startsWith("http")) {
    // Fallback to gradient badge
    const initials = name.substring(0, 1).toUpperCase();
    const hue = (name.charCodeAt(0) * 137.5) % 360;
    
    return (
      <div 
        className="rounded-sm flex items-center justify-center text-white font-bold p-4"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue + 30}, 70%, 40%))`
        }}
      >
        <span className="text-xs">{initials}</span>
      </div>
    );
  }
  
  return (
    <div className='bg-white/10 rounded-sm p-1'>
        <Image
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=256`}
          alt={`${name} logo`}
          width={size}
          height={size}
          quality={75}
          className="rounded-sm"
          onError={() => setError(true)}
        />
    </div>
  );
}