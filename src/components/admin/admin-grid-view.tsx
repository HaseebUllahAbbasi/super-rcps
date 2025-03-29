"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import EditAdminDialog from "./edit-admin-dialog"
import { formatDate, getRoleBadgeColor } from "@/lib/utils"
import { AdminUser } from "@/types"

interface AdminGridViewProps {
  admins: AdminUser[]
  onEdit: (admin: AdminUser) => void
  onDelete: (id: number) => void
}

export default function AdminGridView({ admins, onEdit, onDelete }: AdminGridViewProps) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {admins.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No administrators found matching your filters
        </div>
      ) : (
        admins.map((admin) => (
          <Card key={admin.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{admin.name}</CardTitle>
                  <CardDescription>{admin.email}</CardDescription>
                </div>
                <Badge className={getRoleBadgeColor(admin.role)} variant="outline">
                  {admin.role.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{admin.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Division</span>
                  <span>{admin.division}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Notification</span>
                  <span>{admin.notificationPreference}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(admin.createdAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentAdmin(admin)
                  setIsEditDialogOpen(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the administrator account and remove
                      their data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(admin.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))
      )}

      {currentAdmin && (
        <EditAdminDialog
          admin={currentAdmin}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) setCurrentAdmin(null)
          }}
          onSave={onEdit}
        />
      )}
    </div>
  )
}

