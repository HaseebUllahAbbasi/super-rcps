"use client"
import { BadgeCheck, Building, GalleryVertical, LayoutDashboard, LogOut, Users } from "lucide-react"

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
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
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
    title: "Divisions",
    url: "/divisions",
    icon: Building, // Represents organizational divisions
  },
  {
    title: "Status Settings",
    url: "/statuses",
    icon: BadgeCheck, // Represents geographical locations
  },
  {
    title: "Urgency Settings",
    url: "/urgency-levels",
    icon: BadgeCheck, // Represents geographical locations
  },
  {
    title: "Gallary",
    url: "/gallary",
    icon: GalleryVertical,
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
                    <Link href={item.url} className={cn
                      (
                    item.url == pathname && "text-primary font-extrabold hover:!text-primary",

                        index === items.length - 1 && "text-[red] hover:!text-[red] hover:bg-destructive")
                    }>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
