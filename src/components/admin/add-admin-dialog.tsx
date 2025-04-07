"use client";

import { addNewAdmin } from "@/apis/auth-apis";
import { TextInput } from "@/components/TextField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addAdminSchema } from "@/schemas/user.schema";
import { useAdminStore } from "@/store/useAdminStore";
import { AdminUser } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { USER_ROLES } from "../constants";

const validAdminRoles = Object.values(USER_ROLES).filter(
  role => role !== USER_ROLES.CITIZEN && role !== USER_ROLES.SUPER_ADMIN
);


interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (admin: AdminUser) => void;
}

export default function AddAdminDialog({ open, onOpenChange }: AddAdminDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(addAdminSchema) });
  const { addAdminToStore, divisions } = useAdminStore();
  const [loading, setLoading] = useState(false)

  // handle add admin
  const onSubmit = async (data: any) => {
    console.log(data);
    setLoading(true)
    const response = await addNewAdmin(data);
    setLoading(false)
    console.log(response)
    if (response.error) {
      return toast.error(response.error);
    };
    console.log(addAdminToStore)
    addAdminToStore(response?.data?.admin)
    toast.success(response.data?.message || "Admin added successfully");
    reset();
    onOpenChange(false)
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
              <TextInput id="name" error={errors.name?.message || ""} label={"Name"} {...register("name")} />
              <TextInput id="email" error={errors.email?.message || ""} label={"Email"} {...register("email")} />
              <TextInput id="phone" error={errors.phone?.message || ""} label={"Phone Number"} {...register("phone")} maxLength={11} onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.currentTarget;
                target.value = target.value.replace(/\D/g, ""); // Remove non-numeric characters
              }} />
              <TextInput type="password" id="password" error={errors.password?.message || ""} label={"Password"} {...register("password")} />
              <div className="items-center gap-4">
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
              <div className="items-center gap-4">
                <Label htmlFor="division">Division</Label>
                <Select onValueChange={(value) => setValue("division", value)}>
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent className="max-h-36">
                    {divisions.map((division: any) => (
                      <SelectItem key={division.id} value={division.originalName}>{division.divisionLabel}</SelectItem>
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
              <Button loading={loading} type="submit">Add Administrator</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
