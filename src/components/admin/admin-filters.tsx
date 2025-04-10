"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus } from "lucide-react"
import { SINDH_DISTRICTS, validAdminRoles } from "../constants"

interface AdminFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  roleFilter: string
  setRoleFilter: (value: string) => void
  divisionFilter: string
  setDivisionFilter: (value: string) => void
  onAddClick: () => void
}

export default function AdminFilters({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  divisionFilter,
  setDivisionFilter,
  onAddClick,
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          {validAdminRoles.map(role => (
            <SelectItem key={role} value={role}>{role}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={divisionFilter} onValueChange={setDivisionFilter}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by division" />
        </SelectTrigger>
        <SelectContent>
          {SINDH_DISTRICTS.map((division,index) => (
            <SelectItem key={index} value={division.id}>{division.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button className="gap-2" onClick={onAddClick}>
        <UserPlus className="h-4 w-4" />
        Add Admin
      </Button>
    </div>
  )
}

