import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge class names with Tailwind CSS conflicts resolution
 * @param {...any} inputs - Class names to merge
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Default export for compatibility
export default { cn };
