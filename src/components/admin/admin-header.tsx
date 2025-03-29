import type React from "react"
interface AdminHeaderProps {
  children: React.ReactNode
}

export default function AdminHeader({ children }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Management</h1>
        <p className="text-muted-foreground mt-1">Manage administrators, roles, and permissions</p>
      </div>
      {children}
    </div>
  )
}

