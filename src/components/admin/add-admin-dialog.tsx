"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { AdminUser } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SINDH_DISTRICTS, USER_ROLES } from "../constants";

const validAdminRoles = Object.values(USER_ROLES).filter(
  role => role !== USER_ROLES.CITIZEN && role !== USER_ROLES.SUPER_ADMIN
);
const validDivisions = SINDH_DISTRICTS.map(division => division.id);

const schema = yup.object().shape({
  name: yup.string().min(3).max(50).required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().min(10).max(20).required("Phone is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().oneOf(validAdminRoles, "Invalid role").required("Role is required"),
  division: yup.string().oneOf(validDivisions, "Invalid division").required("Division is required"),
});

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (admin: AdminUser) => void;
}

export default function AddAdminDialog({ open, onOpenChange, onAdd }: AddAdminDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => {
    console.log(data);
    onAdd(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="pt-5 px-5">
          <DialogTitle>Add New Administrator</DialogTitle>
          <DialogDescription>Create a new administrator account with specific roles and permissions.</DialogDescription>
        </DialogHeader>
        
        {/* Scrollable Form Content */}
        <ScrollArea className="max-h-[calc(100vh-140px)] p-4"> 
          <form onSubmit={handleSubmit(onSubmit)} className="p-2">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter full name" className="col-span-3" {...register("name")} />
                <p className="text-red-500 text-sm col-span-4">{errors.name?.message}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" className="col-span-3" {...register("email")} />
                <p className="text-red-500 text-sm col-span-4">{errors.email?.message}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" className="col-span-3" {...register("phone")} />
                <p className="text-red-500 text-sm col-span-4">{errors.phone?.message}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password" className="col-span-3" {...register("password")} />
                <p className="text-red-500 text-sm col-span-4">{errors.password?.message}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setValue("role", value)}>
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {validAdminRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-red-500 text-sm col-span-4">{errors.role?.message}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="division">Division</Label>
                <Select onValueChange={(value) => setValue("division", value)}>
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {SINDH_DISTRICTS.map((division) => (
                      <SelectItem key={division.id} value={division.id}>{division.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-red-500 text-sm col-span-4">{errors.division?.message}</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Administrator</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
