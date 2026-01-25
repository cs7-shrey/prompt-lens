"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Brand } from "@prompt-lens/common-types";
import BrandLogo from "@/components/brand-logo";

interface BrandStackProps {
  brands: Brand[];
  remainingCount?: number;
}

export function BrandStack({ brands, remainingCount }: BrandStackProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const totalItems = brands.length + (remainingCount && remainingCount > 0 ? 1 : 0);

  return (
    <div 
      className="relative flex items-center w-[180px] h-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-7 flex items-center" style={{ width: isHovered ? totalItems * 36 : totalItems * 14 + 14 }}>
        {brands.map((brand, idx) => (
          <motion.div 
            key={brand.id}
            className="absolute ring-2 ring-zinc-900 rounded-md group"
            initial={false}
            animate={{
              x: isHovered ? idx * 36 : idx * 28,
              zIndex: brands.length - idx + 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <BrandLogo 
              domain={brand.websiteUrl} 
              name={brand.displayName} 
              size={28} 
            />
            <div className="absolute opacity-0 -bottom-6 group-hover:opacity-100 transition-opacity duration-500 z-1000">
              <div className="text-[10px] font-medium text-white px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700">
                {brand.displayName}
              </div>
            </div>
          </motion.div>
        ))}
        {remainingCount && remainingCount > 0 && (
          <motion.div
            className="absolute flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 ring-2 ring-zinc-900"
            initial={false}
            animate={{
              x: isHovered ? brands.length * 36 : brands.length * 14,
              zIndex: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <span className="text-[10px] font-medium text-zinc-400">
              +{remainingCount}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
