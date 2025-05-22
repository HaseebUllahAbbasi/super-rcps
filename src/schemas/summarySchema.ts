// schemas/dashboardSummarySchema.ts
import { z } from "zod";

export const dashboardSummarySchema = z.object({
  totalCases: z.number(),
  activeCases: z.number(),
  pendingCases: z.number(),
  completedCases: z.number(),

  dogCounts: z.object({
    male: z.number(),
    female: z.number(),
    unidentified: z.number(),
  }),

  tabsCounts: z.object({
    newComplaintsCount: z.number(),
    inboxComplaintsCount: z.number(),
    sentComplaintsCount: z.number(),
    resolvedComplaintsCount: z.number(),
    rejectedComplaintsCount: z.number(),
  }),

  tnvrCounts: z.object({
    TRAPPED: z.number(),
    NEUTERED: z.number(),
    VACCINATED: z.number(),
    RELEASED: z.number(),
  }),
});
