import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortHash(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function uid(prefix: string) {
  const core = crypto.randomUUID().split('-')[0].toUpperCase();
  return `${prefix}-${core}`;
}

export function nowIso() {
  return new Date().toISOString();
}
