import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getNoteColorClass(color: string): string {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
    case 'purple':
      return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900';
    case 'green':
      return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    case 'yellow':
      return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
    case 'orange':
      return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900';
    case 'red':
      return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
    case 'pink':
      return 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900';
    default:
      return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800';
  }
}
