import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// format a string of lowercases letters, the first letter to uppercase and the rest to lowercase
export function formatString(productName: string): string {
  return (
    productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase()
  )
}
