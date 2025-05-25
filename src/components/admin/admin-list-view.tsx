"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDown, ArrowUp, MoreHorizontal, Edit, Trash2, Key, LoaderPinwheel, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { AdminUser, SortDirection, SortField } from "@/types"
import { formatDate, getRoleBadgeColor } from "@/lib/utils"
import ChangePasswordDialog from "./change-password-dialog"
import { useAdminStore } from "@/store/useAdminStore"

interface AdminListViewProps {
  admins: AdminUser[]
  onDelete: (id: number) => void
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export default function AdminListView({
  admins,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}: AdminListViewProps) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false)
  const {  loading } = useAdminStore()


  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null

    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  // Create sortable header
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort(field)}>
      <div className="flex items-center">
        {children}
        {renderSortIndicator(field)}
      </div>
    </TableHead>
  )

  return (
    <Card className="p-0 rounded-lg">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <TableHead>Phone</TableHead>
              <SortableHeader field="role">Role</SortableHeader>
              <SortableHeader field="division">Division</SortableHeader>
              <TableHead>Notification</TableHead>
              <SortableHeader field="createdAt">Created</SortableHeader>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow>
               <TableCell
                 colSpan={8}
                 className="text-center mx-auto   py-8 text-muted-foreground"
               >
                 <LoaderPinwheel className="h-6 relative mx-auto text-primary animate-spin  w-6" />
               </TableCell>
             </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No administrators found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell>
                    <Badge
                      className={getRoleBadgeColor(admin.role)}
                      variant="outline"
                    >
                      {admin.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.division}</TableCell>
                  <TableCell>{admin.notificationPreference}</TableCell>
                  <TableCell>{formatDate(admin.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentAdmin(admin);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentAdmin(admin);
                            setIsPasswordChangeDialogOpen(true);
                          }}
                        >
                          <Key className="mr-2 h-4 w-4" />
                          Change Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger disabled asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                              <Lock className="ml-auto h-4 w-4" />
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the administrator account and
                                remove their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => onDelete(admin.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

      </CardContent>

      {currentAdmin && (
        <EditAdminDialog
          admin={{
            ...currentAdmin, 

          }}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setCurrentAdmin(null);
          }}
        />
      )}
      {currentAdmin && (
        <ChangePasswordDialog
          admin={currentAdmin}
          open={isPasswordChangeDialogOpen}
          onOpenChange={(open) => {
            setIsPasswordChangeDialogOpen(open);
            if (!open) setCurrentAdmin(null);
          }}
        />
      )}
    </Card>
  );
}

