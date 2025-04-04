"use client"

import { editAdmin } from "@/apis/auth-apis"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addAdminSchema } from "@/schemas/user.schema"
import { useAdminStore } from "@/store/useAdminStore"
import { AdminUser } from "@/types"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TextInput } from "../TextField"
import { ScrollArea } from "../ui/scroll-area"

interface EditAdminDialogProps {
  admin: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditAdminDialog({ admin, open, onOpenChange,  }: EditAdminDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addAdminSchema),
    defaultValues: { ...admin }
  });
  const {  divisions, updateAdmin } = useAdminStore();
  const [loading, setLoading] = useState(false)

  // Update local state when admin prop changes
  const onSubmit = async (data: any) => {
    console.log(data);
    setLoading(true)
    const response = await editAdmin({
      "adminId": data?.id,
      "name": data?.name,
      "email": data?.email,
      "phone": data?.phone,
      "division": data?.division,
    });
    setLoading(false)
    console.log(response)
    if (response.error) {
      return toast.error(response.error);
    };
    // console.log(addAdminToStore)
    // const updatedAdmin = await 
    // addAdminToStore(response?.data?.admin)
    toast.success(response.data?.message || "Admin Updated successfully");
    console.log("data is", response?.data)
    updateAdmin(response?.data)
    onOpenChange(false)
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Administrator</DialogTitle>
          <DialogDescription>Update administrator details and permissions.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-140px)] ">
          <form onSubmit={handleSubmit(onSubmit)} className="p-2">
            <div className="grid gap-4 py-4">
              <TextInput id="name" error={errors.name?.message || ""} label={"Name"} {...register("name")} />
              <TextInput id="email" error={errors.email?.message || ""} label={"Email"} {...register("email")} />
              <TextInput id="phone" error={errors.phone?.message || ""} label={"Phone Number"} {...register("phone")} />
              <div className="items-center gap-4">
                <Label htmlFor="division">Division</Label>
                <Select defaultValue={admin?.division} onValueChange={(value) => setValue("division", value)}>
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Button loading={loading} type="submit">Update Administrator</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

