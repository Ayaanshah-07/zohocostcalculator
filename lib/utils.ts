import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const PAGE_BREAK_CLASS = 'pdf-page-break';

export function getElementsWithPageBreaks(element: HTMLElement): HTMLElement[] {
  return Array.from(element.getElementsByClassName(PAGE_BREAK_CLASS)) as HTMLElement[];
}
