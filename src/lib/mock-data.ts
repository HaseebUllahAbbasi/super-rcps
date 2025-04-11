import { DivisionType } from "@/types"

// Mock divisions data
export const divisions: DivisionType[] = ["North", "South", "East", "West", "Central"]

// Mock data for demonstration
export const mockAdmins: any[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "admin",
    division: "North",
    notificationPreference: "email",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+9876543210",
    role: "divisional_head",
    division: "South",
    notificationPreference: "app",
    createdAt: "2023-02-20T14:45:00Z",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1122334455",
    role: "super_admin",
    division: "East",
    notificationPreference: "whatsapp",
    createdAt: "2023-03-10T09:15:00Z",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+5566778899",
    role: "admin",
    division: "West",
    notificationPreference: "sms",
    createdAt: "2023-04-05T16:20:00Z",
  },
]