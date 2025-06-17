"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TextInput } from "../TextField";
import { LoadingScreen } from "../reuseable/loading";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { addNewUrgencyLevelByAdmin, updateUrgencyLevelByAdmin } from "@/apis/auth-apis";
import { useAdminStore } from "@/store/useAdminStore";
import { tailwindToInlineStyle } from "@/utils/helper";
import { extractColorValues } from "../status/StatusesTable"; // reuse the function


const urgencySchema = z.object({
    originalName: z.string().optional(), // only required in Add
    citizenLabel: z.string().min(1, "Citizen label is required"),
    adminLabel: z.string().min(1, "Admin label is required"),
    bgColor: z.string().min(1),
    textColor: z.string().min(1),
    borderColor: z.string().min(1),
    urgencyWait: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Urgency wait must be a number" }),
});

// Initialize defualt values
const defaultUrgencyValues = {
    citizenLabel: "",
    adminLabel: "",
    bgColor: "#000000",
    textColor: "#ffffff",
    borderColor: "#000000",
    urgencyWait: 0,
};


export const UrgencyLevelsTable = () => {

    const { fetchUsers, loading: adminLoading, urgencyLevels, updateUrgencyLevel, addUrgencyLevel } = useAdminStore();
    const [editUrgency, setEditUrgency] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);


    const { register, handleSubmit, reset, watch } = useForm({
        resolver: zodResolver(urgencySchema),
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (urgency) => {
        const { bgColor, textColor, borderColor } = extractColorValues(urgency.colorStyles || "");
        setEditUrgency(urgency);
        reset({
            ...urgency,
            bgColor,
            textColor,
            borderColor,
            urgencyWait: urgency?.urgencyWait || 0,
        });
    };

    // handle Edit
    const handleUpdate = async (data) => {
        setLoading(true);
        const payload = {
            ...data,
            urgencyWait: data?.urgencyWait?.toString(),
            colorStyles: `!bg-[${data.bgColor}] !text-[${data.textColor}] !border-[${data.borderColor}]`,
        };

        delete payload.bgColor;
        delete payload.textColor;
        delete payload.borderColor;

        const { data: updated, error } = await updateUrgencyLevelByAdmin(editUrgency.id, payload);
        setLoading(false);

        if (error) return toast.error(error);
        console.log({ updated })
        updateUrgencyLevel(updated?.urgencyLevel);
        toast.success("Urgency level updated successfully");
        setEditUrgency(null);
    };

    // handle add new 
    const onSubmitAdd = async (data) => {
        setLoading(true);
        const payload = {
            ...data,
            urgencyWait: data?.urgencyWait?.toString(),
            colorStyles: `!bg-[${data.bgColor}] !text-[${data.textColor}] !border-[${data.borderColor}]`,
        };

        delete payload.bgColor;
        delete payload.textColor;
        delete payload.borderColor;

        try {
            const { data: newLevel, error } = await addNewUrgencyLevelByAdmin(payload); // or createUrgencyLevel
            if (error) return toast.error(error);

            addUrgencyLevel(newLevel?.urgencyLevel); // Append it
            toast.success("Urgency level added");
            setIsAddOpen(false);
        } catch (err) {
            toast.error("Failed to add urgency level");
        } finally {
            setLoading(false);
        }
    };


    if (!urgencyLevels) {
        return <LoadingScreen fullScreen={true} text="Loading..." />;
    }

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold mb-4">Urgency Levels</h2>
                <Button onClick={() => {
                    reset(defaultUrgencyValues);
                    setIsAddOpen(true);
                }} className="mb-4">
                    + Add New Urgency Level
                </Button>

            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Original Name</TableHead>
                        <TableHead>Citizen Label</TableHead>
                        <TableHead>Admin Label</TableHead>
                        <TableHead>Preview</TableHead>
                        <TableHead>Urgency Wait</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {urgencyLevels.map((urgency, index) => (
                        <TableRow key={urgency.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{urgency.originalName}</TableCell>
                            <TableCell>{urgency.citizenLabel}</TableCell>
                            <TableCell>{urgency.adminLabel}</TableCell>
                            <TableCell>
                                <Badge
                                    className="border text-sm capitalize"
                                    style={tailwindToInlineStyle(urgency.colorStyles || "")}
                                >
                                    {urgency.adminLabel}
                                </Badge>
                            </TableCell>
                            <TableCell>{urgency?.urgencyWait}</TableCell>
                            <TableCell>
                                <Button size="icon" variant="ghost" onClick={() => handleEdit(urgency)}>
                                    <Edit size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit Dialog */}
            <Dialog open={!!editUrgency} onOpenChange={setEditUrgency}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Urgency Level</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <div className="space-y-4">
                            <TextInput {...register("citizenLabel")} label="Citizen Label" />
                            <TextInput {...register("adminLabel")} label="Admin Label" />
                            <div>
                                <TextInput {...register("urgencyWait")} label="Urgency Wait (e.g. 1, 2, 3)" type="number" />
                            </div>


                            <div>
                                <label className="text-sm font-medium mb-1 block">Background Color</label>
                                <input type="color" {...register("bgColor")} className="h-10 w-16 p-1 border rounded" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Text Color</label>
                                <input type="color" {...register("textColor")} className="h-10 w-16 p-1 border rounded" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Border Color</label>
                                <input type="color" {...register("borderColor")} className="h-10 w-16 p-1 border rounded" />
                            </div>

                            <div className="text-center mt-4">
                                <Badge
                                    className="rounded-full p-2 border-2 font-semibold"
                                    style={{
                                        backgroundColor: watch("bgColor"),
                                        color: watch("textColor"),
                                        borderColor: watch("borderColor"),
                                        borderWidth: "2px",
                                    }}
                                >
                                    {watch("adminLabel")}
                                </Badge>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit" loading={loading}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Urgency Level</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitAdd)}>
                        <div className="space-y-4">
                            <TextInput {...register("originalName")} label="Original Name" />
                            <TextInput {...register("citizenLabel")} label="Citizen Label" />
                            <TextInput {...register("adminLabel")} label="Admin Label" />
                            <TextInput {...register("urgencyWait")} label="Urgency Wait" type="number" />
                            <div>
                                <label className="text-sm font-medium mb-1 block">Background Color</label>
                                <input type="color" {...register("bgColor")} className="h-10 w-16 p-1 border rounded" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Text Color</label>
                                <input type="color" {...register("textColor")} className="h-10 w-16 p-1 border rounded" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Border Color</label>
                                <input type="color" {...register("borderColor")} className="h-10 w-16 p-1 border rounded" />
                            </div>
                            <div className="text-center mt-4">
                                <Badge
                                    className="rounded-full p-2 border-2 font-semibold"
                                    style={{
                                        backgroundColor: watch("bgColor"),
                                        color: watch("textColor"),
                                        borderColor: watch("borderColor"),
                                        borderWidth: "2px",
                                    }}
                                >
                                    {watch("adminLabel") || "Preview"}
                                </Badge>
                            </div>
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
