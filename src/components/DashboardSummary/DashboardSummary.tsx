import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { TextInput } from "../TextField";
import { dashboardSummarySchema } from "@/schemas/summarySchema";
import { getStaticSummaryById, insertStaticSummaryService } from "@/apis/auth-apis";

export const DashboardSummaryModal = ({ open, onOpenChange }: any) => {
  const summaryId = 1
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(dashboardSummarySchema),
    defaultValues: {
      totalCases: 0,
      activeCases: 0,
      pendingCases: 0,
      completedCases: 0,
      dogCounts: { male: 0, female: 0, unidentified: 0 },
      tabsCounts: {
        newComplaintsCount: 0,
        inboxComplaintsCount: 0,
        sentComplaintsCount: 0,
        resolvedComplaintsCount: 0,
        rejectedComplaintsCount: 0,
      },
      tnvrCounts: { TRAPPED: 0, NEUTERED: 0, VACCINATED: 0, RELEASED: 0 },
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!summaryId) return; // or handle error

    setLoading(true);
    getStaticSummaryById(summaryId).then(({ data, error }) => {
      console.log({data})
      setLoading(false);
      if (error) {
        toast.error(error);
        return;
      }
      // Populate form with fetched data
      reset(data);
    });
  }, [open, summaryId, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { error } = await insertStaticSummaryService(summaryId,data);
    setLoading(false);
    if (error) return toast.error(error);
    toast.success("Dashboard Summary Inserted");
    onOpenChange(false);
    reset();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-scroll w-8/12">
        <DialogHeader>
          <DialogTitle>Submit Dashboard Summary</DialogTitle>
          <DialogDescription>
            Fill all the required dashboard fields before submitting.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* General Counts */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              id="totalCases"
              label="Total Cases"
              type="number"
              {...register("totalCases", { valueAsNumber: true })}
            />
            <TextInput
              id="activeCases"
              label="Active Cases"
              type="number"
              {...register("activeCases", { valueAsNumber: true })}
            />
            <TextInput
              id="pendingCases"
              label="Pending Cases"
              type="number"
              {...register("pendingCases", { valueAsNumber: true })}
            />
            <TextInput
              id="completedCases"
              label="Completed Cases"
              type="number"
              {...register("completedCases", { valueAsNumber: true })}
            />
          </div>

          {/* Dog Counts */}
          <div>
            <h4 className="font-medium text-lg">Dog Counts</h4>
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                id="dogCounts.male"
                label="Male"
                type="number"
                {...register("dogCounts.male", { valueAsNumber: true })}
              />
              <TextInput
                id="dogCounts.female"
                label="Female"
                type="number"
                {...register("dogCounts.female", { valueAsNumber: true })}
              />
              <TextInput
                id="dogCounts.unidentified"
                label="Unidentified"
                type="number"
                {...register("dogCounts.unidentified", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Tabs Counts */}
          <div>
            <h4 className="font-medium text-lg">Tabs Counts</h4>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                id="tabsCounts.newComplaintsCount"
                label="New Complaints"
                type="number"
                {...register("tabsCounts.newComplaintsCount", { valueAsNumber: true })}
              />
              <TextInput
                id="tabsCounts.inboxComplaintsCount"
                label="Inbox Complaints"
                type="number"
                {...register("tabsCounts.inboxComplaintsCount", { valueAsNumber: true })}
              />
              <TextInput
                id="tabsCounts.sentComplaintsCount"
                label="Sent Complaints"
                type="number"
                {...register("tabsCounts.sentComplaintsCount", { valueAsNumber: true })}
              />
              <TextInput
                id="tabsCounts.resolvedComplaintsCount"
                label="Resolved Complaints"
                type="number"
                {...register("tabsCounts.resolvedComplaintsCount", { valueAsNumber: true })}
              />
              <TextInput
                id="tabsCounts.rejectedComplaintsCount"
                label="Rejected Complaints"
                type="number"
                {...register("tabsCounts.rejectedComplaintsCount", { valueAsNumber: true })}
              />
            </div>
            {/* TNVR Counts */}
            <div>
              <h4 className="font-medium text-lg">TNVR Counts</h4>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  id="tnvrCounts.TRAPPED"
                  label="Trapped"
                  type="number"
                  {...register("tnvrCounts.TRAPPED", { valueAsNumber: true })}
                />
                <TextInput
                  id="tnvrCounts.NEUTERED"
                  label="Neutered"
                  type="number"
                  {...register("tnvrCounts.NEUTERED", { valueAsNumber: true })}
                />
                <TextInput
                  id="tnvrCounts.VACCINATED"
                  label="Vaccinated"
                  type="number"
                  {...register("tnvrCounts.VACCINATED", { valueAsNumber: true })}
                />
                <TextInput
                  id="tnvrCounts.RELEASED"
                  label="Released"
                  type="number"
                  {...register("tnvrCounts.RELEASED", { valueAsNumber: true })}
                />
              </div>
            </div>

          </div>

          <DialogFooter>
            <Button type="submit" loading={loading}>
              Submit Summary
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
