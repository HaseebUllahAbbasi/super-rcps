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

const statusSchema = z.object({
  statusLabel: z.string().min(1, "Status label is required"),
  citizenLabel: z.string().min(1, "Citizen label is required"),
  adminLabel: z.string().min(1, "Admin label is required")
});

const ComplaintStatusTable = () => {
  const { statuses, updateStatus } = useAdminStore();
  const [editStatus, setEditStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(statusSchema)
  });
  const handleEdit = (status) => {
    setEditStatus(status);
    reset(status);
  };

  const handleUpdate = async (updatedStatusInfo) => {
    setLoading(true);
    const { data, error } = await updateStatusLabelByAdmin(editStatus?.id, updatedStatusInfo);
    setLoading(false);
    if (error) return toast.error(error);
    console.log("---",data);
    updateStatus(data?.status)
    toast.success(data?.message || "Status Updated Successfully");
    console.log(editStatus.id, data);
    setEditStatus(null);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status Label</TableHead>
            <TableHead>Citizen Label</TableHead>
            <TableHead>Admin Label</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.map((status) => (
            <TableRow key={status.id}>
              <TableCell>{status.id}</TableCell>
              <TableCell>{status.statusLabel}</TableCell>
              <TableCell>{status.citizenLabel}</TableCell>
              <TableCell>{status.adminLabel}</TableCell>
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
              <TextInput {...register("statusLabel")} label="Status Label" />
              <TextInput {...register("citizenLabel")} label="Citizen Label" />
              <TextInput {...register("adminLabel")} label="Admin Label" />
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
