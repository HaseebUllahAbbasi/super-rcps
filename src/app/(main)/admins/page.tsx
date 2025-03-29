"use client"

import { addNewAdmin } from "@/apis/auth-apis"
import AddAdminDialog from "@/components/admin/add-admin-dialog"
import AdminFilters from "@/components/admin/admin-filters"
import AdminGridView from "@/components/admin/admin-grid-view"
import AdminHeader from "@/components/admin/admin-header"
import AdminListView from "@/components/admin/admin-list-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminStore } from "@/store/useAdminStore"
import type { AdminUser, SortDirection, SortField } from "@/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"


export default function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [divisionFilter, setDivisionFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { fetchUsers, admins } = useAdminStore()


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const handleAddAdmin = async (data: any) => {
    console.log(data);
    const response = await addNewAdmin(data);
    console.log(response)
    if (response.error) {
      return toast.error(response.error);
    };
    toast.success(response.data?.message || "Admin added successfully");
    setIsAddDialogOpen(false)
  }
  console.log(admins)
  // Filter admins based on search term and filters
  const filteredAdmins = admins?.filter((admin: AdminUser) => {
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


  // Handle editing an admin
  const handleEditAdmin = (updatedAdmin: AdminUser) => {
    console.log(updatedAdmin)
  }

  // Handle deleting an admin
  const handleDeleteAdmin = (id: number) => {
    console.log(id)
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

