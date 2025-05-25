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
import { AdminUser, Division } from "@/types"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TextInput } from "../TextField"
import { ScrollArea } from "../ui/scroll-area"
import { formatCNIC, formatPhoneNumber } from "@/lib/utils"

interface EditAdminDialogProps {
  admin: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditAdminDialog({ admin, open, onOpenChange, }: EditAdminDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(addAdminSchema),
    defaultValues: { ...admin, cnic:formatCNIC(admin?.cnic), phone: formatPhoneNumber(admin?.phone) }
  });
  const { divisions, updateAdmin } = useAdminStore();
  const [loading, setLoading] = useState(false)

  // Update local state when admin prop changes
  const onSubmit = async (data: any) => {
    console.log(data);
    setLoading(true)
    const response = await editAdmin({
      "adminId": data?.id,
      "name": data?.name,
      "email": data?.email,
      "cnic": data?.cnic.replace(/-/g, ""),
      "phone": data?.phone.replace(/-/g, ""),
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



  useEffect(() => {
   if(divisions) {
     const filterDIvision = divisions.filter((division: Division) => division.divisionLabel === admin?.division)

    if(filterDIvision?.length > 0) {
      console.log(filterDIvision, filterDIvision[0].originalName)
      setValue("division", filterDIvision[0].originalName)
    }
    
   }
  }, [divisions])


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
              <TextInput id="name" error={errors.name?.message || ""} placeholder="Enter full name" label={"Name"} {...register("name")} />
              <TextInput id="email" error={errors.email?.message || ""} placeholder="Enter email address" label={"Email"} {...register("email")} />
              <TextInput id="phone" error={errors.phone?.message || ""} 
                placeholder="03XX-XXXXXXX"
               label={"Phone Number"}  {...register("phone", {
                  onChange: (e) => {
                    const input = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                    let formatted = input.slice(0, 11); // Limit to 11 digits

                    // Add a hyphen after the 4th digit
                    if (formatted.length > 4) {
                      formatted =
                        formatted.slice(0, 4) + "-" + formatted.slice(4);
                    }

                    setValue("phone", formatted, {
                      shouldValidate: true,
                    }); // Update field value
                  },
                })} />
              <TextInput id="cnic" error={errors.cnic?.message || ""} placeholder="Enter CNIC without dashes" label={"CNIC"}    {...register("cnic", {
                  onChange: (e) => {
                    let input = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                    if (input.length > 13) {
                      input = input.slice(0, 13); // Limit to 13 characters
                    }

                    let formatted = input;

                    // Add hyphens at the 6th and 13th positions
                    if (input.length > 5) {
                      formatted = input.slice(0, 5) + "-" + input.slice(5);
                    }
                    if (input.length > 12) {
                      formatted =
                        formatted.slice(0, 13) + "-" + formatted.slice(13);
                    }

                    setValue("cnic", formatted, { shouldValidate: true }); // Update the value in the form
                  },
                })}/>
              <div className="items-center gap-4">
                <Label htmlFor="division">Division</Label>
<Select value={watch("division")} onValueChange={(value) => setValue("division", value)}>
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {divisions.map((division: Division,index:number) => (
                      <SelectItem key={index} value={division.originalName}>{division.divisionLabel}</SelectItem>
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

