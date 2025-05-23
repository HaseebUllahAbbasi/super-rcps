// Enum types that match your database schema
export type RoleType = "citizen" | "admin" | "divisional_head" | "super_admin";
export type NotificationPreferenceType = "app" | "sms" | "whatsapp" | "email";

// Division type (not in your schema but used in the UI)
export type DivisionType = "North" | "South" | "East" | "West" | "Central";

// Base user type that matches your database schema
export interface BaseUser {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: RoleType;
  notificationPreference: NotificationPreferenceType;
  resetPasswordOtp?: string;
  resetPasswordExpiry?: string;
}

// Admin user with ID and timestamps
export interface AdminUser extends BaseUser {
  id: number;
  cnic: string;
  phone: string;
  division?: string;
  createdAt: string;
  updatedAt?: string;
}

// Type for creating a new admin (omitting auto-generated fields)
export type NewAdminUser = Omit<AdminUser, "id" | "createdAt" | "updatedAt" | "resetPasswordOtp" | "resetPasswordExpiry" | "password">;

// Type for updating an admin (all fields optional except id)
export type UpdateAdminUser = Partial<Omit<AdminUser, "id" | "createdAt" | "updatedAt">> & { id: number };

// Response types for API operations
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AdminsResponse extends ApiResponse {
  data?: AdminUser[];
}

export interface AdminResponse extends ApiResponse {
  data?: AdminUser;
}

// Filter types for the UI
export interface AdminFilters {
  searchTerm?: string;
  role?: RoleType | "all";
  division?: string | "all";
}

// Sort options
export type SortField = "name" | "email" | "role" | "division" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

export interface Division{
  id:number,
  originalName:string
  divisionLabel:string
  createdAt:string
  updatedAt:string
}




// Gallary Types 
export type Tag = {
  id: number
  name: string
  description: string | null
}

export type ImageTag = {
  imageId: number
  tagId: number
  tag: Tag
}

export type Image = {
  id: number
  title: string
  description: string | null
  imageUrl: string
  displayOrder: number
  createdAt: string
  updatedAt: string
  imageTags: ImageTag[]
}




export interface JwtPayload{
  id?:string,
  role?:"citizen" |"admin"| "divisional_head" |"super_admin" |"director"
  name?:string,
}