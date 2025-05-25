"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Edit } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../TextField";
import { updateStatusLabelByAdmin } from "../../apis/auth-apis";
import { toast } from "sonner";
import { useAdminStore } from "../../store/useAdminStore";
import { useEffect } from "react";
import { LoadingScreen } from "../reuseable/loading";
import { Badge } from "../ui/badge";
import {tailwindToInlineStyle} from  "../../utils/helper"

export function extractColorValues(tailwindString) {
  const bgMatch = tailwindString.match(/!bg-\[#([0-9a-fA-F]{6})\]/);
  const textMatch = tailwindString.match(/!text-\[#([0-9a-fA-F]{6})\]/);
  const borderMatch = tailwindString.match(/!border-\[#([0-9a-fA-F]{6})\]/);

  return {
    bgColor: bgMatch ? `#${bgMatch[1]}` : "#ffffff",
    textColor: textMatch ? `#${textMatch[1]}` : "#000000",
    borderColor: borderMatch ? `#${borderMatch[1]}` : "#cccccc",
  };
}


const statusSchema = z.object({
  statusLabel: z.string().min(1, "Status label is required"),
  citizenLabel: z.string().min(1, "Citizen label is required"),
  adminLabel: z.string().min(1, "Admin label is required"),
  bgColor: z.string().min(1, "Background color is required"),
  textColor: z.string().min(1, "Text color is required"),
  borderColor: z.string().min(1, "Border color is required"),
});

const ComplaintStatusTable = () => {
  const { fetchUsers, statuses, updateStatus, loading: adminLoading } = useAdminStore();
  const [editStatus, setEditStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(statusSchema),
  });

const handleEdit = (status) => {
  const { bgColor, textColor, borderColor } = extractColorValues(status.colorStyles || "");
  
  setEditStatus(status);
  reset({
    ...status,
    bgColor,
    textColor,
    borderColor,
  });
};

  const handleUpdate = async (updatedStatusInfo) => {
    setLoading(true);
    const payload = {
      ...updatedStatusInfo,
      colorStyles: `!bg-[${updatedStatusInfo?.bgColor}] !text-[${updatedStatusInfo?.textColor}] !border-[${updatedStatusInfo?.borderColor}] `,
    };
    delete payload?.textColor;
    delete payload?.bgColor;
    const { data, error } = await updateStatusLabelByAdmin(editStatus?.id, payload);
    setLoading(false);
    if (error) return toast.error(error);
    console.log("---", data);
    updateStatus(data?.status);
    toast.success(data?.message || "Status Updated Successfully");
    console.log(editStatus.id, data);
    setEditStatus(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (adminLoading) {
    return <LoadingScreen fullScreen={true} text="Loading..." />;
  }

  return (
    <div>
      {/* Table */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Statuses</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>General Label</TableHead>
            <TableHead>Citizen Label</TableHead>
            <TableHead>Admin Label</TableHead>
            <TableHead>Badge Preview</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.map((status, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{status.statusLabel}</TableCell>
              <TableCell>{status.citizenLabel}</TableCell>
              <TableCell>{status.adminLabel}</TableCell>
              <TableCell>  <Badge className={`border border-green-800 text-black shadow-md capitalize bg-transparent`} style={tailwindToInlineStyle(status?.colorStyles||"")}>{status?.adminLabel}</Badge></TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(status)}>
                  <Edit size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={!!editStatus} onOpenChange={setEditStatus}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div className="space-y-4">
              <TextInput {...register("statusLabel")} label="Status Label" disabled={true} />
              <TextInput {...register("citizenLabel")} label="Citizen Label" />
              <TextInput {...register("adminLabel")} label="Admin Label" />
              {/* Color Pickers */}
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input type="color" {...register("bgColor")} className="h-10 w-16 p-1 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input type="color" {...register("textColor")} className="h-10 w-16 p-1 border rounded" />
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">Border Color</label>
              <input type="color" {...register("borderColor")} className="h-10 w-16 p-1 border rounded" />
            </div>
            <div className="text-center">
              <Badge
                className="rounded-full mx-auto p-2 border-2 font-semibold mt-2 text-center"
                style={{
                  backgroundColor: watch("bgColor"),
                  color: watch("textColor"),
                  borderColor: watch("borderColor"),
                  borderWidth: "2px",
                }}
              >
                {editStatus?.adminLabel || ""}
              </Badge>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" loading={loading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintStatusTable;
