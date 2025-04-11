"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminStore } from "@/store/useAdminStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, LoaderPinwheel, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addNewDivision, updateDivisionById } from "../../apis/auth-apis";
import { TextInput } from "../TextField";
import { DialogDescription } from "@radix-ui/react-dialog";
import { LoadingScreen } from "../reuseable/loading";

const divisionSchema = z.object({
  divisionLabel: z.string().min(1, "Division label is required"),
  originalName: z.string().min(1, "Division original is required"),
});

const DivisionManagement = () => {
  const { fetchUsers, divisions, updateDivision, addDivision,loading: adminLoading  } = useAdminStore();
  const [editDivision, setEditDivision] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(divisionSchema),
  });

  const handleEdit = (division) => {
    setEditDivision(division);
    reset(division);
  };


    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]);

  const handleUpdate = async (updatedDivisionInfo) => {
    setLoading(true);
    const { data, error } = await updateDivisionById(editDivision?.id, updatedDivisionInfo);
    setLoading(false);
    if (error) return toast.error(error);
    updateDivision(data?.division);
    toast.success("Division Updated Successfully");
    setEditDivision(null);
  };

  const handleAddDivision = async (newDivisionInfo) => {
    setLoading(true);
    const { data, error } = await addNewDivision(newDivisionInfo);
    setLoading(false);
    if (error) return toast.error(error);
    addDivision(data?.division);
    toast.success("New Division Added Successfully");
    setAddDialogOpen(false);
    reset();
  };

  if(adminLoading) {
    return <LoadingScreen fullScreen={true} text="Loading..." />;
  }
  
  return (
    <div>
      {/* Table */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Divisions</h2>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus size={16} className="mr-2" /> Add Division
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Original Name</TableHead>
            <TableHead>Division Label</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {divisions?.map((division, index) => (
            <TableRow key={index}>
              <TableCell>{index}</TableCell>
              <TableCell>{division?.originalName}</TableCell>
              <TableCell>{division?.divisionLabel}</TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(division)}>
                  <Edit size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Division Modal */}
      <Dialog open={!!editDivision} onOpenChange={setEditDivision}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Division</DialogTitle>
            <DialogDescription>You can update the existing division label from here !</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div className="space-y-4">
              <TextInput {...register("divisionLabel")} placeholder="Enter the display name for the division" label="Division Label" />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" loading={loading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add New Division Modal */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Division</DialogTitle>
            <DialogDescription>You can add division here !</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddDivision)}>
            <div className="space-y-4">
              <TextInput
                labelDescription={"⚠️ Only lowercase letters are allowed. No numbers or special characters."}
                placeholder="e.g. karachi_central"
                {...register("originalName")}
                label="Original Name"
                onInput={(e) => {
                  const target = e.currentTarget;
                  target.value = target.value
                    .replace(/[^a-zA-Z\s]/g, "") // Remove non-letters (excluding spaces)
                    .replace(/\s+/g, "_")
                    .toLowerCase(); // Replace spaces with underscores
                }}
              />
              <TextInput {...register("divisionLabel")}   placeholder="Enter the display name for the division" label="Division Label" className="mt-3" />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" loading={loading}>
                Add Division
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DivisionManagement;
