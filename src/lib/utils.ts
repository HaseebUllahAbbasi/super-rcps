import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};


export const getRoleBadgeColor = (role: string): string => { switch (role) { case "super_admin": return "bg-red-100 text-red-800 hover:bg-red-100"; case "divisional_head": return "bg-blue-100 text-blue-800 hover:bg-blue-100"; case "admin": return "bg-green-100 text-green-800 hover:bg-green-100"; default: return "bg-gray-100 text-gray-800 hover:bg-gray-100"; } };