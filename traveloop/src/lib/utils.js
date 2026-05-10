import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Yeh function dynamically Tailwind classes ko combine karne ke kaam aata hai
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}