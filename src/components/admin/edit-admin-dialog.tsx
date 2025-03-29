"use client"

import { useState, useEffect } from "react"
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
import { AdminUser, NotificationPreferenceType, RoleType } from "@/types"

interface EditAdminDialogProps {
  admin: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (admin: AdminUser) => void
}

export default function EditAdminDialog({ admin, open, onOpenChange, onSave }: EditAdminDialogProps) {
  const [editedAdmin, setEditedAdmin] = useState<AdminUser>(admin)

  // Update local state when admin prop changes
  useEffect(() => {
    setEditedAdmin(admin)
  }, [admin])

  const handleSubmit = () => {
    onSave(editedAdmin)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Administrator</DialogTitle>
          <DialogDescription>Update administrator details and permissions.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={editedAdmin.name}
              onChange={(e) => setEditedAdmin({ ...editedAdmin, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={editedAdmin.email}
              onChange={(e) => setEditedAdmin({ ...editedAdmin, email: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-phone" className="text-right">
              Phone
            </Label>
            <Input
              id="edit-phone"
              value={editedAdmin.phone}
              onChange={(e) => setEditedAdmin({ ...editedAdmin, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-role" className="text-right">
              Role
            </Label>
            <Select
              value={editedAdmin.role}
              onValueChange={(value) => setEditedAdmin({ ...editedAdmin, role: value as RoleType })}
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
            <Label htmlFor="edit-division" className="text-right">
              Division
            </Label>
            <Select
              value={editedAdmin.division || ""}
              onValueChange={(value) => setEditedAdmin({ ...editedAdmin, division: value })}
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
            <Label htmlFor="edit-notification" className="text-right">
              Notification
            </Label>
            <Select
              value={editedAdmin.notificationPreference}
              onValueChange={(value) =>
                setEditedAdmin({ ...editedAdmin, notificationPreference: value as NotificationPreferenceType })
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
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

