"use client"

import { useState } from "react"
import { divisions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminUser, NewAdminUser, NotificationPreferenceType, RoleType } from "@/types"

interface AddAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (admin: Partial<AdminUser>) => void
}

export default function AddAdminDialog({ open, onOpenChange, onAdd }: AddAdminDialogProps) {
  const [newAdmin, setNewAdmin] = useState<Partial<NewAdminUser>>({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    division: "",
    notificationPreference: "app",
  })

  const handleSubmit = () => {
    onAdd(newAdmin)
    // Reset form
    setNewAdmin({
      name: "",
      email: "",
      phone: "",
      role: "admin",
      division: "",
      notificationPreference: "app",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Administrator</DialogTitle>
          <DialogDescription>Create a new administrator account with specific roles and permissions.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newAdmin.name || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newAdmin.email || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={newAdmin.phone || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={newAdmin.role || "admin"}
              onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value as RoleType })}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="divisional_head">Divisional Head</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="division" className="text-right">
              Division
            </Label>
            <Select
              value={newAdmin.division || ""}
              onValueChange={(value) => setNewAdmin({ ...newAdmin, division: value })}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((division) => (
                  <SelectItem key={division} value={division}>
                    {division}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notification" className="text-right">
              Notification
            </Label>
            <Select
              value={newAdmin.notificationPreference || "app"}
              onValueChange={(value) =>
                setNewAdmin({ ...newAdmin, notificationPreference: value as NotificationPreferenceType })
              }
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select notification preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">App</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Administrator</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

