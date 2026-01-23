import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLogoUrl(domain: string, size = 512) {
  
  return {
    primary: `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
    fallback: `https://logo.clearbit.com/${domain}`,
  };
}