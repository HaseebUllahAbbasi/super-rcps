"use client"

import { useState } from "react"
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
import { ScrollArea } from "../ui/scroll-area"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { changePasswordSchema } from "@/schemas/user.schema"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { AdminUser } from "@/types"
import { changePassword } from "@/apis/auth-apis"

interface ChangePasswordDialogProps {
  admin: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { password: string; confirmPassword: string }) => void
}

export default function ChangePasswordDialog({ admin, open, onOpenChange,  }: ChangePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    console.log(data);
       setLoading(true)
       const response = await changePassword({
         "adminId": admin?.id,
         "password": data?.password,
       });
       setLoading(false)
       console.log(response)
       if (response.error) {
         return toast.error(response.error);
       };
      
       toast.success(response.data?.message || "Admin Password Changed successfully");
       console.log("data is", response?.data)
       onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Enter a new password for this administrator.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-140px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button loading={loading} type="submit">Change Password</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
