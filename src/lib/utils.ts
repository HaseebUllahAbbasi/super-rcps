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


// Format Pakistani phone number: 03XX-XXXXXXX
export const formatPhoneNumber = (input: string): string => {
  const cleaned = input.replace(/\D/g, "").slice(0, 11); // Only digits, max 11
  if (cleaned.length <= 4) return cleaned;
  return cleaned.slice(0, 4) + "-" + cleaned.slice(4);
};

// Format CNIC: XXXXX-XXXXXXX-X
export const formatCNIC = (input: string): string => {
  const cleaned = input.replace(/\D/g, "").slice(0, 13); // Only digits, max 13
  if (cleaned.length <= 5) return cleaned;
  if (cleaned.length <= 12)
    return cleaned.slice(0, 5) + "-" + cleaned.slice(5);
  return (
    cleaned.slice(0, 5) +
    "-" +
    cleaned.slice(5, 12) +
    "-" +
    cleaned.slice(12, 13)
  );
};
