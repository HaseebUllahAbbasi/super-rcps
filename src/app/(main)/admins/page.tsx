"use client"

import AddAdminDialog from "@/components/admin/add-admin-dialog"
import AdminFilters from "@/components/admin/admin-filters"
import AdminGridView from "@/components/admin/admin-grid-view"
import AdminHeader from "@/components/admin/admin-header"
import AdminListView from "@/components/admin/admin-list-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockAdmins } from "@/lib/mock-data"
import type { AdminUser, SortDirection, SortField } from "@/types"
import { useState } from "react"


export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [divisionFilter, setDivisionFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Filter admins based on search term and filters
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm)

    const matchesRole = roleFilter === "all" || admin.role === roleFilter
    const matchesDivision = divisionFilter === "all" || admin.division === divisionFilter

    return matchesSearch && matchesRole && matchesDivision
  })

  // Sort admins based on sort field and direction
  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    const aValue = a[sortField] || ""
    const bValue = b[sortField] || ""

    // Handle special case for dates
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime()
    }

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    // Fallback for other types
    return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1
  })

  // Handle sorting when a header is clicked
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle adding a new admin
  const handleAddAdmin = (newAdmin: Partial<AdminUser>) => {
    const id = Math.max(...admins.map((admin) => admin.id), 0) + 1
    const createdAt = new Date().toISOString()

    // Create a new admin with required fields
    const adminToAdd: AdminUser = {
      id,
      name: newAdmin.name || "",
      email: newAdmin.email || "",
      phone: newAdmin.phone || "",
      role: newAdmin.role || "admin",
      division: newAdmin.division,
      notificationPreference: newAdmin.notificationPreference || "app",
      createdAt,
    }

    setAdmins([...admins, adminToAdd])
    setIsAddDialogOpen(false)
  }

  // Handle editing an admin
  const handleEditAdmin = (updatedAdmin: AdminUser) => {
    setAdmins(admins.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin)))
  }

  // Handle deleting an admin
  const handleDeleteAdmin = (id: number) => {
    setAdmins(admins.filter((admin) => admin.id !== id))
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="list" className="w-full">
        <AdminHeader>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
        </AdminHeader>

        <AdminFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          divisionFilter={divisionFilter}
          setDivisionFilter={setDivisionFilter}
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        <TabsContent value="list" className="space-y-4">
          <AdminListView
            admins={sortedAdmins}
            onEdit={handleEditAdmin}
            onDelete={handleDeleteAdmin}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <AdminGridView admins={sortedAdmins} onEdit={handleEditAdmin} onDelete={handleDeleteAdmin} />
        </TabsContent>
      </Tabs>

      <AddAdminDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddAdmin} />
    </div>
  )
}

