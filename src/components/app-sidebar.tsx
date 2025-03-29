"use client"
import { Briefcase, Building, LayoutDashboard, LogOut, MapPin, Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"


// Menu items with appropriate icons.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard, // Better representation for a dashboard
  },
  {
    title: "Admins",
    url: "/admins",
    icon: Users, // Represents people/administrators
  },
  {
    title: "Divisional Head",
    url: "/divisional-head",
    icon: Briefcase, // Represents leadership/management
  },
  {
    title: "Divisions",
    url: "/divisions",
    icon: Building, // Represents organizational divisions
  },
  {
    title: "Districts",
    url: "/districts",
    icon: MapPin, // Represents geographical locations
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar>
      <SidebarContent>
      <Image src="/logo.png" alt="Logo" width={250} height={120} />

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className={cn
                      (
                    item.url == pathname && "text-primary font-extrabold hover:!text-primary",

                        index === items.length - 1 && "text-[red] hover:!text-[red] hover:bg-destructive")
                    }>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
